// Starfield WebGL shader — mounted on any <canvas data-shader="starfield">.
// Used by V6 (desktop) and M6 (mobile) wireframe heroes.
//
// Same shader as Hero Shader Options.html option 01 · Particles:
// 3 parallax layers of stars, twinkle, diffraction spikes on bright stars,
// faint nebula wash, occasional shooting-star streak.

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
    vec2 hash2(vec2 p) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)))) * 43758.5453);
    }
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

  const FS_STARFIELD = `
    float starGlyph(vec2 d, float size, float spikeMul) {
      float r = length(d) + 1e-6;
      float core = exp(-r*r / (size*size * 0.08));
      float halo = (size / (r + size*0.35)) * exp(-r*5.0) * 0.35;
      vec2 ad = abs(d);
      float sx = exp(-ad.y*140.0) / (ad.x*22.0 + 1.0);
      float sy = exp(-ad.x*140.0) / (ad.y*22.0 + 1.0);
      float spikes = (sx + sy) * exp(-r*7.0);
      return core + halo + spikes * spikeMul;
    }

    vec3 starLayer(vec2 uv, float cellSize, float seed, vec2 drift, float sizeBase, float spikeStrength) {
      vec2 p = (uv + drift) / cellSize;
      vec2 i = floor(p);
      vec2 f = fract(p) - 0.5;
      vec3 acc = vec3(0.0);
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 g = vec2(float(dx), float(dy));
          vec2 cell = i + g;
          vec2 rnd = hash2(cell + vec2(seed*17.1, seed*23.7));
          float bright = hash(cell + seed*51.3);
          bright = pow(bright, 2.4);
          vec2 offset = (rnd - 0.5) * 0.85;
          vec2 d = (f - g - offset) * cellSize;
          float size     = sizeBase * mix(0.55, 1.7, bright);
          float spikeMul = pow(bright, 6.0) * spikeStrength;
          float starV   = starGlyph(d, size, spikeMul);
          float twPhase = rnd.x * 6.28318;
          float twRate  = mix(1.4, 5.0, rnd.y);
          float tw      = 0.45 + 0.55 * sin(u_time*twRate + twPhase);
          tw = mix(0.35, 1.0, tw*tw);
          float hueRnd = hash(cell + seed*7.7);
          vec3 cool = vec3(0.72, 0.82, 1.05);
          vec3 warm = vec3(1.05, 0.92, 0.78);
          vec3 tint = mix(cool, warm, hueRnd);
          tint = mix(vec3(1.0), tint, 0.75);
          float intensity = mix(0.25, 1.5, bright);
          acc += tint * starV * intensity * tw;
        }
      }
      return acc;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
      float t = u_time;

      vec3 col = vec3(0.005, 0.008, 0.018);
      float neb = fbm(uv*1.6 + vec2(t*0.010, t*0.004));
      col += vec3(0.03, 0.02, 0.07) * smoothstep(0.55, 0.95, neb) * 0.35;

      col += starLayer(uv, 0.065, 1.0, vec2(t*0.008,  t*0.002), 0.0022, 0.0);
      col += starLayer(uv, 0.17,  2.0, vec2(t*0.018,  t*0.004), 0.0055, 0.55);
      col += starLayer(uv, 0.36,  3.0, vec2(t*0.034,  t*0.008), 0.0110, 1.80);

      // shooting star — thin tapering line segment every ~7s
      float period = 7.0;
      float seg = floor(t / period);
      float st  = fract(t / period);
      float window = 0.13;
      float u = st / window;
      if (u < 1.0) {
        vec2 ssSeed  = vec2(seg*1.7 + 0.3, 9.1);
        vec2 ssStart = vec2(1.30 + hash(ssSeed)*0.30,
                            0.32 + hash(ssSeed + 3.1)*0.22);
        vec2 ssDir   = normalize(vec2(-1.0, -0.30 - hash(ssSeed + 7.0)*0.22));
        vec2 ssHead = ssStart + ssDir * u * 2.6;
        float lenEnv = smoothstep(0.0, 0.18, u) * (1.0 - smoothstep(0.78, 1.0, u));
        float trailLen = 0.32 * lenEnv;
        vec2 ssTail = ssHead - ssDir * trailLen;
        vec2 ab = ssHead - ssTail;
        float L2 = max(dot(ab, ab), 1e-6);
        float h  = clamp(dot(uv - ssTail, ab) / L2, 0.0, 1.0);
        vec2 cp  = ssTail + ab * h;
        float dperp = length(uv - cp);
        float along = pow(h, 1.6);
        float perp = exp(-dperp*dperp * 90000.0);
        float life = smoothstep(0.0, 0.04, u) * (1.0 - smoothstep(0.88, 1.0, u));
        vec3 ssColor = mix(vec3(0.88, 0.94, 1.05), vec3(1.0, 0.92, 0.78), 0.25);
        col += ssColor * along * perp * life * 1.15;
      }

      float v = 1.0 - smoothstep(0.55, 1.35, length(uv));
      col *= mix(0.55, 1.0, v);
      col += vec3(0.010, 0.018, 0.040) * (1.0 - smoothstep(-0.1, 0.55, uv.y));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("starfield shader compile error:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function mount(canvas) {
    if (canvas.__sf_mounted) return;
    canvas.__sf_mounted = true;

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) { canvas.style.display = "none"; return; }

    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, LIB + "\n" + FS_STARFIELD);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("starfield link error:", gl.getProgramInfoLog(prog));
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
        canvas.__sf_mounted = false;
      }
    }
    requestAnimationFrame(frame);
  }

  window.mountStarfield = mount;
})();
