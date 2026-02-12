import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { ArrowLeft, Mouse, Keyboard } from "lucide-react";

/* ===================== COMPONENT ===================== */

const RoomVisualizer = ({ hallsData }) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  // Scene & Core
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const hallGroupRef = useRef(null);
  const controlsRef = useRef(null);

  // Orbit State
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const zoomingIn = useRef(false);
  const zoomingOut = useRef(false);

  // Walk State
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const prevTime = useRef(performance.now());

  // UI State
  const [selectedHall, setSelectedHall] = useState(hallsData[0]);
  const [isWalkMode, setIsWalkMode] = useState(false);

  /* ===================== INIT SCENE ===================== */

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    // Initial Orbit Position
    camera.position.set(18, 14, 18);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    canvasRef.current = renderer.domElement;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Hall Group
    const hallGroup = new THREE.Group();
    scene.add(hallGroup);
    hallGroupRef.current = hallGroup;

    // FPS Controls
    const controls = new PointerLockControls(camera, renderer.domElement);
    controlsRef.current = controls;

    controls.addEventListener("lock", () => setIsWalkMode(true));
    controls.addEventListener("unlock", () => {
      setIsWalkMode(false);
      // Reset camera to orbit view when exiting walk mode
      camera.position.set(18, 14, 18);
      camera.lookAt(0, 0, 0);
      camera.rotation.set(0, 0, 0); // Reset rotation for proper orbit lookAt next frame
    });
    // controls.getObject() was removed in newer Three.js versions. 
    // The camera is attached directly.
    scene.add(camera);

    /* ===================== ANIMATION ===================== */

    const animate = () => {
      const time = performance.now();
      const delta = (time - prevTime.current) / 1000;
      prevTime.current = time;

      const cam = cameraRef.current;

      if (controls.isLocked) {
        // --- FPS MOVEMENT ---
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;

        direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.current.normalize(); // consistent speed in all directions

        if (moveForward.current || moveBackward.current)
          velocity.current.z -= direction.current.z * 100.0 * delta; // speed
        if (moveLeft.current || moveRight.current)
          velocity.current.x -= direction.current.x * 100.0 * delta;

        controls.moveRight(-velocity.current.x * delta);
        controls.moveForward(-velocity.current.z * delta);

        // Keep on floor (simple height lock)
        if (cam.position.y !== 3) cam.position.y = 3; // Eye level
      } else {
        // --- ORBIT CONTROLS (MANUAL) ---
        // Z key zoom
        if (cam) {
          const dir = new THREE.Vector3();
          cam.getWorldDirection(dir);

          if (zoomingIn.current) {
            cam.position.add(dir.multiplyScalar(0.4));
          }

          if (zoomingOut.current) {
            cam.position.add(dir.multiplyScalar(-0.4));
          }

          // Clamp zoom distance
          const dist = cam.position.length();
          const minDist = 6;
          const maxDist = 50;
          if (dist < minDist) cam.position.setLength(minDist);
          if (dist > maxDist) cam.position.setLength(maxDist);

          if (!isDragging.current) {
            cam.lookAt(0, 0, 0); // Ensure looking at center when not dragging (or always for this simple orbit)
          }
        }
      }

      renderer.render(scene, cam);
      requestAnimationFrame(animate);
    };
    animate();

    /* ===================== EVENTS ===================== */

    const onResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    };

    // Mouse Events for Orbit
    const onMouseDown = (e) => {
      if (controls.isLocked) return;
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (controls.isLocked || !isDragging.current) return;

      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;

      const cam = cameraRef.current;
      // Simple spherical rotation logic
      const angle = Math.atan2(cam.position.z, cam.position.x);
      const radius = Math.sqrt(cam.position.x ** 2 + cam.position.z ** 2);

      cam.position.x = radius * Math.cos(angle - dx * 0.005);
      cam.position.z = radius * Math.sin(angle - dx * 0.005);
      cam.position.y = Math.min(30, Math.max(4, cam.position.y + dy * 0.05));

      cam.lookAt(0, 0, 0);
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging.current = false);

    // Keyboard Events for Walk & Zoom
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w': moveForward.current = true; break;
        case 'a': moveLeft.current = true; break;
        case 's': moveBackward.current = true; break;
        case 'd': moveRight.current = true; break;
        case 'z': zoomingIn.current = true; break;
        case 'm': zoomingOut.current = true; break;
      }
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w': moveForward.current = false; break;
        case 'a': moveLeft.current = false; break;
        case 's': moveBackward.current = false; break;
        case 'd': moveRight.current = false; break;
        case 'z': zoomingIn.current = false; break;
        case 'm': zoomingOut.current = false; break;
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    renderer.domElement.addEventListener("mousedown", onMouseDown);

    /* ===================== CLEANUP ===================== */

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);

      renderer.dispose();
      renderer.forceContextLoss();

      if (canvasRef.current?.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
      canvasRef.current = null;
    };
  }, []);

  /* ===================== UPDATE HALL ===================== */

  useEffect(() => {
    if (!hallGroupRef.current) return;
    hallGroupRef.current.clear();
    createHall(selectedHall, hallGroupRef.current);
  }, [selectedHall]);

  /* ===================== MODELS (Same as before) ===================== */
  // ... (keeping models identical)
  const createChair = (x, z, group) => {
    const mat = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.55), mat);
    seat.position.set(x, 0.45, z);
    group.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.1), mat);
    back.position.set(x, 0.8, z + 0.25);
    group.add(back);
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.45);
    [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([dx, dz]) => {
      const leg = new THREE.Mesh(legGeo, mat);
      leg.position.set(x + dx, 0.225, z + dz);
      group.add(leg);
    });
  };

  const createBench = (x, z, group) => {
    const mat = new THREE.MeshPhongMaterial({ color: 0x8b6914 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.55), mat);
    seat.position.set(x, 0.45, z);
    group.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 0.12), mat);
    back.position.set(x, 0.8, z + 0.3);
    group.add(back);
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45);
    [-1.2, 0, 1.2].forEach((lx) => {
      [-0.22, 0.22].forEach((lz) => {
        const leg = new THREE.Mesh(legGeo, mat);
        leg.position.set(x + lx, 0.225, z + lz);
        group.add(leg);
      });
    });
  };

  const createBoardText = (title, subtitle, boardMesh, group) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 512;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 96px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 70);
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#d1fae5";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 2.1), material);
    textPlane.position.copy(boardMesh.position);
    textPlane.position.z += 0.08;
    textPlane.rotation.copy(boardMesh.rotation);
    group.add(textPlane);
  };

  const createHall = (hall, group) => {
    const width = hall.columns * 2;
    const depth = hall.rows * 2;
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(width + 4, 0.2, depth + 6),
      new THREE.MeshPhongMaterial({ color: 0x1f2937 }),
    );
    floor.position.y = -0.1;
    group.add(floor);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(8, 2.5, 0.15),
      new THREE.MeshPhongMaterial({ color: 0x0f5132 }),
    );
    board.position.set(0, 2, -(depth / 2) - 2.5);
    group.add(board);
    createBoardText(hall.name.toUpperCase(), "CEC-GRID", board, group);
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.4, 1.5),
      new THREE.MeshPhongMaterial({ color: 0x8b5a2b }),
    );
    desk.position.set(0, 0.7, -(depth / 2) - 0.8);
    group.add(desk);
    for (let r = 0; r < hall.rows; r++) {
      for (let c = 0; c < hall.columns; c++) {
        const x = (c - hall.columns / 2 + 0.5) * 2;
        const z = (r - hall.rows / 2 + 0.5) * 2;
        if (hall.seatingType === "bench") {
          if (c % 3 !== 0) continue;
          createBench(x, z, group);
        } else {
          createChair(x, z, group);
        }
      }
    }
  };

  /* ===================== UI HANDLERS ===================== */

  const startWalk = () => {
    if (controlsRef.current) {
      // Set starting position for walk
      cameraRef.current.position.set(0, 3, 10); // Start at entrance
      controlsRef.current.lock();
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="relative w-full h-screen bg-gray-900 flex flex-col">
      {/* Hall Tabs */}
      {!isWalkMode && (
        <div className="bg-gray-800 p-4 flex gap-2 z-10 relative">
          {hallsData.map((hall) => (
            <button
              key={hall.id}
              onClick={() => setSelectedHall(hall)}
              className={`px-4 py-2 rounded ${hall.id === selectedHall.id
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
                }`}
            >
              {hall.name}
            </button>
          ))}
        </div>
      )}

      {/* Instructions Overlay */}
      <div className="absolute top-20 left-4 z-20 pointer-events-none">
        {!isWalkMode ? (
          <div className="bg-black/50 p-4 rounded-lg text-white backdrop-blur-sm pointer-events-auto">
            <h3 className="font-bold mb-2">Controls</h3>
            <p className="text-sm">Left Click + Drag to Orbit</p>
            <p className="text-sm">Z / M to Zoom In/Out</p>
            <button
              onClick={startWalk}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold w-full transition-colors flex items-center justify-center gap-2"
            >
              <Mouse size={16} /> Enter Walk-Through Mode
            </button>
          </div>
        ) : (
          <div className="bg-black/50 p-4 rounded-lg text-white backdrop-blur-sm">
            <h3 className="font-bold mb-2 text-green-400">Walk Mode Active</h3>
            <div className="flex items-center gap-2 text-sm mb-1"><Keyboard size={16} /> <span><strong>WASD</strong> to Move</span></div>
            <div className="flex items-center gap-2 text-sm mb-1"><Mouse size={16} /> <span><strong>Mouse</strong> to Look</span></div>
            <div className="text-xs text-gray-400 mt-2">Press <strong>ESC</strong> to exit</div>
          </div>
        )}
      </div>

      <div
        ref={mountRef}
        className="flex-1 cursor-grab active:cursor-grabbing w-full h-full absolute top-0 left-0"
      />
    </div>
  );
};

export default RoomVisualizer;
