import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Eye, Zap } from 'lucide-react';

interface Planet {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  color: string;
  size: number;
  speed: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: string;
  orb: number;
  strength: number;
  color: string;
}

interface ThreeChartEngineProps {
  planets: Planet[];
  aspects: Aspect[];
  width?: number;
  height?: number;
}

export default function ThreeChartEngine({ 
  planets, 
  aspects, 
  width = 800, 
  height = 600 
}: ThreeChartEngineProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [cameraDistance, setCameraDistance] = useState(1000);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAspects, setShowAspects] = useState(true);

  // Planet meshes storage
  const planetMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
  const aspectLines = useRef<THREE.Group>(new THREE.Group());
  const orbitLines = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    if (!mountRef.current) return;

    initializeThreeJS();
    createScene();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      updatePlanets();
      updateAspects();
      updateOrbits();
    }
  }, [planets, aspects, showOrbits, showAspects]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraDistance;
    }
  }, [cameraDistance]);

  const initializeThreeJS = () => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
    camera.position.set(0, 200, cameraDistance);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Add event listeners
    renderer.domElement.addEventListener('click', onCanvasClick);
  };

  const createScene = () => {
    if (!sceneRef.current) return;

    // Add cosmic background
    createCosmicBackground();
    
    // Add lighting
    createLighting();
    
    // Add central star (Sun)
    createCentralStar();
    
    // Initialize groups
    if (sceneRef.current) {
      sceneRef.current.add(aspectLines.current);
      sceneRef.current.add(orbitLines.current);
    }
  };

  const createCosmicBackground = () => {
    if (!sceneRef.current) return;

    // Star field
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4000;
      positions[i + 1] = (Math.random() - 0.5) * 4000;
      positions[i + 2] = (Math.random() - 0.5) * 4000;

      const intensity = Math.random();
      colors[i] = intensity;
      colors[i + 1] = intensity;
      colors[i + 2] = intensity;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    sceneRef.current.add(stars);

    // Nebula effect
    createNebula();
  };

  const createNebula = () => {
    if (!sceneRef.current) return;

    const nebulaGeometry = new THREE.SphereGeometry(2000, 32, 32);
    const nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 nebula = vec3(0.5, 0.2, 0.8) * intensity;
          
          // Add some noise for swirling effect
          float noise = sin(vPosition.x * 0.01 + time) * sin(vPosition.y * 0.01 + time);
          nebula *= (1.0 + noise * 0.3);
          
          gl_FragColor = vec4(nebula, intensity * 0.3);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      side: THREE.BackSide
    });

    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    sceneRef.current.add(nebula);
  };

  const createLighting = () => {
    if (!sceneRef.current) return;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    sceneRef.current.add(ambientLight);

    // Sun light
    const sunLight = new THREE.PointLight(0xffa500, 2, 2000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sceneRef.current.add(sunLight);

    // Directional light for general illumination
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(100, 100, 100);
    sceneRef.current.add(directionalLight);
  };

  const createCentralStar = () => {
    if (!sceneRef.current) return;

    // Sun geometry with corona effect
    const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
    const sunMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 corona = vec3(1.0, 0.6, 0.0) * intensity;
          
          // Add solar flare effect
          float flare = sin(time * 2.0) * 0.2 + 0.8;
          corona *= flare;
          
          gl_FragColor = vec4(corona, 1.0);
        }
      `,
      uniforms: {
        time: { value: 0 }
      }
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sceneRef.current.add(sun);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(40, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 6.0);
          gl_FragColor = vec4(1.0, 0.5, 0.0, intensity * 0.6);
        }
      `,
      transparent: true,
      side: THREE.BackSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sceneRef.current.add(glow);
  };

  const updatePlanets = () => {
    if (!sceneRef.current) return;

    // Clear existing planet meshes
    planetMeshes.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
    });
    planetMeshes.current.clear();

    planets.forEach(planet => {
      const orbitRadius = getPlanetOrbitRadius(planet.name);
      const angle = (planet.longitude * Math.PI) / 180;
      
      // Planet position
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = planet.latitude * 5; // Slight orbital inclination

      // Planet geometry
      const geometry = new THREE.SphereGeometry(planet.size * 2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: planet.color,
        shininess: 30,
        transparent: true,
        opacity: 0.9
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { planetName: planet.name };

      // Planet glow
      const glowGeometry = new THREE.SphereGeometry(planet.size * 2.5, 16, 16);
      const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 color;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(color, intensity * 0.4);
          }
        `,
        uniforms: {
          color: { value: new THREE.Color(planet.color) }
        },
        transparent: true,
        side: THREE.BackSide
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(mesh.position);
      
      if (sceneRef.current) {
        sceneRef.current.add(mesh);
        sceneRef.current.add(glow);
        planetMeshes.current.set(planet.name, mesh);
      }

      // Add planet label
      createPlanetLabel(planet.name, mesh.position);
    });
  };

  const createPlanetLabel = (name: string, position: THREE.Vector3) => {
    // Create text sprite for planet label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 32;
    
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.font = 'bold 16px Arial';
    context.textAlign = 'center';
    context.fillText(name, 64, 20);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.copy(position);
    sprite.position.y += 50;
    sprite.scale.set(80, 20, 1);
    
    sceneRef.current?.add(sprite);
  };

  const updateOrbits = () => {
    if (!sceneRef.current || !showOrbits) return;

    // Clear existing orbits
    orbitLines.current.clear();

    planets.forEach(planet => {
      const orbitRadius = getPlanetOrbitRadius(planet.name);
      if (orbitRadius === 0) return; // Skip Sun

      const orbitGeometry = new THREE.RingGeometry(orbitRadius - 1, orbitRadius + 1, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });

      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      orbitLines.current.add(orbit);
    });

    sceneRef.current.add(orbitLines.current);
  };

  const updateAspects = () => {
    if (!sceneRef.current || !showAspects) return;

    // Clear existing aspects
    aspectLines.current.clear();

    aspects.forEach(aspect => {
      const planet1Mesh = planetMeshes.current.get(aspect.planet1);
      const planet2Mesh = planetMeshes.current.get(aspect.planet2);

      if (!planet1Mesh || !planet2Mesh) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        planet1Mesh.position,
        planet2Mesh.position
      ]);

      const material = new THREE.LineBasicMaterial({
        color: aspect.color,
        transparent: true,
        opacity: aspect.strength * 0.8,
        linewidth: 2
      });

      const line = new THREE.Line(geometry, material);
      aspectLines.current.add(line);
    });

    sceneRef.current.add(aspectLines.current);
  };

  const getPlanetOrbitRadius = (planetName: string): number => {
    const orbits: Record<string, number> = {
      Sun: 0,
      Moon: 80,
      Mercury: 120,
      Venus: 160,
      Mars: 200,
      Jupiter: 280,
      Saturn: 360,
      Uranus: 440,
      Neptune: 520,
      Pluto: 600
    };
    return orbits[planetName] || 100;
  };

  const onCanvasClick = (event: MouseEvent) => {
    if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

    const mouse = new THREE.Vector2();
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(
      Array.from(planetMeshes.current.values())
    );

    if (intersects.length > 0) {
      const planetName = intersects[0].object.userData.planetName;
      setSelectedPlanet(planetName === selectedPlanet ? null : planetName);
    } else {
      setSelectedPlanet(null);
    }
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Rotate camera around scene
    if (isAnimating) {
      const time = Date.now() * 0.001;
      cameraRef.current.position.x = Math.cos(time * rotationSpeed) * cameraDistance;
      cameraRef.current.position.z = Math.sin(time * rotationSpeed) * cameraDistance;
      cameraRef.current.lookAt(0, 0, 0);
    }

    // Update shader uniforms
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial) {
        if (object.material.uniforms.time) {
          object.material.uniforms.time.value = Date.now() * 0.001;
        }
      }
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    if (!animationRef.current) {
      animate();
    }
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 200, cameraDistance);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
  };

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, rotationSpeed, cameraDistance]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="p-4 bg-black/50 border-b border-yellow-600/30">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isAnimating ? stopAnimation : startAnimation}
              className="border-yellow-500"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? 'Pause' : 'Animate'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetCamera}
              className="border-yellow-500"
            >
              <RotateCcw className="w-4 h-4" />
              Reset View
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOrbits(!showOrbits)}
              className={`border-yellow-500 ${showOrbits ? 'bg-yellow-600' : ''}`}
            >
              <Eye className="w-4 h-4" />
              Orbits
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAspects(!showAspects)}
              className={`border-yellow-500 ${showAspects ? 'bg-yellow-600' : ''}`}
            >
              <Zap className="w-4 h-4" />
              Aspects
            </Button>
          </div>
          
          {selectedPlanet && (
            <Badge className="bg-orange-600">
              Selected: {selectedPlanet}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm">Rotation Speed</label>
            <Slider
              value={[rotationSpeed * 1000]}
              onValueChange={([value]) => setRotationSpeed(value / 1000)}
              min={0}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-white text-sm">Camera Distance</label>
            <Slider
              value={[cameraDistance]}
              onValueChange={([value]) => setCameraDistance(value)}
              min={500}
              max={2000}
              step={50}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width, height }} />
      
      {/* Status */}
      <div className="p-2 bg-black/50 border-t border-yellow-600/30 text-white text-sm flex justify-between">
        <span>Advanced 3D Cosmic Visualization</span>
        <span>Planets: {planets.length} | Aspects: {aspects.length}</span>
      </div>
    </div>
  );
}