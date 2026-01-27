import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ===================== COMPONENT ===================== */

const RoomVisualizer = ({ hallsData }) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const hallGroupRef = useRef(null);

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  const zoomingIn = useRef(false);
  const zoomingOut = useRef(false);
  const [selectedHall, setSelectedHall] = useState(hallsData[0]);

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

    /* ===================== ANIMATION ===================== */

    const animate = () => {
      const cam = cameraRef.current;

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
        const minDist = 6;
        const maxDist = 40;
        const dist = cam.position.length();

        if (dist < minDist) cam.position.setLength(minDist);
        if (dist > maxDist) cam.position.setLength(maxDist);
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

    const onMouseDown = (e) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;

      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;

      const cam = cameraRef.current;
      const angle = Math.atan2(cam.position.z, cam.position.x);
      const radius = Math.sqrt(cam.position.x ** 2 + cam.position.z ** 2);

      cam.position.x = radius * Math.cos(angle - dx * 0.005);
      cam.position.z = radius * Math.sin(angle - dx * 0.005);
      cam.position.y = Math.min(30, Math.max(4, cam.position.y + dy * 0.05));

      cam.lookAt(0, 0, 0);
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging.current = false);

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === "z") zoomingIn.current = true;
      if (key === "m") zoomingOut.current = true; // 👈 zoom out
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();

      if (key === "z") zoomingIn.current = false;
      if (key === "m") zoomingOut.current = false;
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

  /* ===================== MODELS ===================== */

  const createChair = (x, z, group) => {
    const mat = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.55), mat);
    seat.position.set(x, 0.45, z);
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.1), mat);
    back.position.set(x, 0.8, z + 0.25);
    group.add(back);

    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.45);
    [
      [-0.22, -0.22],
      [0.22, -0.22],
      [-0.22, 0.22],
      [0.22, 0.22],
    ].forEach(([dx, dz]) => {
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

    // ===== TITLE =====
    ctx.font = "bold 96px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 70);

    // ===== SUBTITLE =====
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#d1fae5";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 40);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    // Plane sized slightly smaller than board
    const textPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 2.1),
      material,
    );

    // ⬇️ Stick to board surface
    textPlane.position.copy(boardMesh.position);
    textPlane.position.z += 0.08; // tiny offset to avoid z-fighting

    // ⬇️ Match board rotation (THIS is the key)
    textPlane.rotation.copy(boardMesh.rotation);

    group.add(textPlane);
  };

  /* ===================== HALL ===================== */

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

    // ✅ Text looks painted on the board
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

  /* ===================== UI ===================== */

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-4 flex gap-2">
        {hallsData.map((hall) => (
          <button
            key={hall.id}
            onClick={() => setSelectedHall(hall)}
            className={`px-4 py-2 rounded ${
              hall.id === selectedHall.id
                ? "bg-blue-600 text-white ml-24"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {hall.name}
          </button>
        ))}
      </div>

      <div
        ref={mountRef}
        className="flex-1 cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default RoomVisualizer;
