// Currents WebGL shader — mounted on any <canvas data-shader="currents">.
// Same shader as Radio Paradise Promo.html — smooth retro horizontal waves
// over deep ink-blue. Used behind the Radio Paradise tile on the final page.

(function () {
  "use strict";

  const VS = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const LIB = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
                 mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * vnoise(p); p *= 2.0; a *= 0.5; }
      return v;
    }
  `;

  const FS_CURRENTS = `
    void main() {
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 p = uv;
      p.x *= u_res.x / u_res.y;
      float t = u_time;

      vec3 col = vec3(0.022, 0.032, 0.078);
      col += vec3(0.012, 0.025, 0.060) * smoothstep(1.0, 0.0, uv.y);

      for (int i = 0; i < 9; i++) {
        float fi = float(i);
        float y0 = fi * 0.11 + 0.06;
        float wave =
            sin(p.x * 2.0 + t * 0.55 + fi * 0.70) * 0.028
          + sin(p.x * 4.3 - t * 0.40 + fi * 1.35) * 0.012
          + cos(p.x * 1.1 + t * 0.32 + fi * 2.10) * 0.018;
        float pulse = 0.5 + 0.5 * sin(t * 0.45 + fi * 0.85);
        float thickness = 0.038 + 0.028 * pulse;
        float dist = abs(p.y - (y0 + wave));
        float core = smoothstep(thickness, 0.0, dist);
        float glow = smoothstep(thickness * 3.0, 0.0, dist) * 0.22;
        float line = core + glow;
        vec3 cTop = vec3(0.35, 0.65, 1.05);
        vec3 cBot = vec3(0.55, 0.78, 1.00);
        vec3 streak = mix(cBot, cTop, fract(fi * 0.31));
        float bright = 0.34 + 0.20 * pulse;
        col += streak * line * bright;
      }

      float v = 1.0 - smoothstep(0.50, 1.15, length(uv - 0.5));
      col *= mix(0.72, 1.0, v);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("currents shader compile error:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function mount(canvas) {
    if (canvas.__cu_mounted) return;
    canvas.__cu_mounted = true;

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) { canvas.style.display = "none"; return; }

    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, LIB + "\n" + FS_CURRENTS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("currents link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_res");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    let visible = true;
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.02 });
    io.observe(canvas);

    const start = performance.now();
    function frame(now) {
      if (visible && canvas.isConnected) {
        resize();
        if (canvas.width > 0 && canvas.height > 0) {
          gl.uniform1f(uTime, (now - start) / 1000);
          gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      }
      if (canvas.isConnected) {
        requestAnimationFrame(frame);
      } else {
        io.disconnect();
        canvas.__cu_mounted = false;
      }
    }
    requestAnimationFrame(frame);
  }

  window.mountCurrents = mount;
})();
