import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Eye, Zap, Orbit, Star, Sparkles } from 'lucide-react';

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

interface Advanced3DEngineProps {
  planets: Planet[];
  aspects: Aspect[];
  width?: number;
  height?: number;
}

export default function Advanced3DEngine({ 
  planets, 
  aspects, 
  width = 800, 
  height = 600 
}: Advanced3DEngineProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState([0.5]);
  const [cameraDistance, setCameraDistance] = useState([1000]);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAspects, setShowAspects] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [viewMode, setViewMode] = useState<'cosmic' | 'geometric' | 'heliocentric'>('cosmic');
  const [aspectFilter, setAspectFilter] = useState('all');

  // Three.js object references
  const planetMeshes = useRef<Map<string, THREE.Mesh>>(new Map());
  const aspectLines = useRef<THREE.Group>(new THREE.Group());
  const orbitLines = useRef<THREE.Group>(new THREE.Group());
  const starField = useRef<THREE.Points>();
  const nebula = useRef<THREE.Mesh>();

  useEffect(() => {
    if (!mountRef.current) return;

    initializeThreeJS();
    createCosmicScene();
    startAnimation();
    
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
  }, [planets, aspects, showOrbits, showAspects, viewMode, aspectFilter]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraDistance[0];
    }
  }, [cameraDistance]);

  const initializeThreeJS = () => {
    if (!mountRef.current) return;

    // Scene with deep space background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);
    sceneRef.current = scene;

    // Camera with wider field of view
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 300, cameraDistance[0]);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Event listeners
    renderer.domElement.addEventListener('click', onCanvasClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
  };

  const createCosmicScene = () => {
    if (!sceneRef.current) return;

    // Create starfield background
    createStarField();
    
    // Create nebula background
    createNebula();
    
    // Create cosmic lighting
    createAdvancedLighting();
    
    // Create central star (Sun)
    createCentralStar();
    
    // Initialize object groups
    sceneRef.current.add(aspectLines.current);
    sceneRef.current.add(orbitLines.current);
  };

  const createStarField = () => {
    if (!sceneRef.current) return;

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Random sphere distribution
      const radius = Math.random() * 8000 + 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Star colors (blue-white to red-orange)
      const temp = Math.random();
      if (temp > 0.8) {
        colors[i3] = 0.6 + Math.random() * 0.4;     // Red giants
        colors[i3 + 1] = 0.3 + Math.random() * 0.3;
        colors[i3 + 2] = 0.1;
      } else if (temp > 0.6) {
        colors[i3] = 1;                              // Sun-like stars
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 0.6 + Math.random() * 0.4;
      } else {
        colors[i3] = 0.7 + Math.random() * 0.3;     // Blue-white stars
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i3 + 2] = 1;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    starField.current = stars;
    sceneRef.current.add(stars);
  };

  const createNebula = () => {
    if (!sceneRef.current) return;

    // Create multiple nebula layers for depth
    const nebulaGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(6000, 6000);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.1 - i * 0.02,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });

      // Create gradient texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, `rgba(${100 + i * 50}, ${50 + i * 30}, ${200 + i * 20}, 0.3)`);
      gradient.addColorStop(0.5, `rgba(${80 + i * 30}, ${40 + i * 20}, ${150 + i * 40}, 0.1)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      material.map = texture;

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        -3000 - i * 1000
      );
      mesh.rotation.z = Math.random() * Math.PI * 2;
      
      nebulaGroup.add(mesh);
    }

    nebula.current = nebulaGroup as any;
    sceneRef.current.add(nebulaGroup);
  };

  const createAdvancedLighting = () => {
    if (!sceneRef.current) return;

    // Ambient cosmic light
    const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
    sceneRef.current.add(ambientLight);

    // Central star light (Sun)
    const sunLight = new THREE.PointLight(0xffa500, 2, 5000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sceneRef.current.add(sunLight);

    // Secondary cosmic lights
    const light1 = new THREE.DirectionalLight(0x4080ff, 0.3);
    light1.position.set(1000, 500, 1000);
    sceneRef.current.add(light1);

    const light2 = new THREE.DirectionalLight(0xff8040, 0.2);
    light2.position.set(-1000, -500, -1000);
    sceneRef.current.add(light2);
  };

  const createCentralStar = () => {
    if (!sceneRef.current) return;

    // Sun with corona effect
    const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
    
    // Create sun material with emissive glow
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.9
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);

    // Add corona effect
    const coronaGeometry = new THREE.SphereGeometry(45, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });

    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sun.add(corona);

    sceneRef.current.add(sun);
  };

  const updatePlanets = () => {
    if (!sceneRef.current) return;

    // Clear existing planets
    planetMeshes.current.forEach(mesh => {
      sceneRef.current!.remove(mesh);
    });
    planetMeshes.current.clear();

    planets.forEach(planet => {
      const mesh = createPlanetMesh(planet);
      if (mesh) {
        planetMeshes.current.set(planet.name, mesh);
        sceneRef.current!.add(mesh);
      }
    });
  };

  const createPlanetMesh = (planet: Planet): THREE.Mesh | null => {
    // Calculate 3D position from longitude
    const angle = (planet.longitude * Math.PI) / 180;
    const radius = getPlanetOrbitalRadius(planet.name);
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = planet.latitude * 5; // Slight Y offset for latitude

    // Create planet geometry
    const geometry = new THREE.SphereGeometry(planet.size * 2, 16, 16);
    
    // Create planet material
    const material = new THREE.MeshPhongMaterial({
      color: planet.color,
      shininess: planet.name === 'Sun' ? 0 : 30,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.userData = { planet };

    // Add atmospheric glow for gas giants
    if (['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(planet.name)) {
      const glowGeometry = new THREE.SphereGeometry(planet.size * 2.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      mesh.add(glow);
    }

    // Add ring system for Saturn
    if (planet.name === 'Saturn') {
      const ringGeometry = new THREE.RingGeometry(planet.size * 3, planet.size * 5, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xccaa77,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      mesh.add(rings);
    }

    return mesh;
  };

  const getPlanetOrbitalRadius = (planetName: string): number => {
    const distances: Record<string, number> = {
      Sun: 0,
      Moon: 150,
      Mercury: 200,
      Venus: 250,
      Mars: 350,
      Jupiter: 500,
      Saturn: 650,
      Uranus: 800,
      Neptune: 950,
      Pluto: 1100
    };
    return distances[planetName] || 300;
  };

  const updateOrbits = () => {
    if (!sceneRef.current || !showOrbits) return;

    // Clear existing orbits
    orbitLines.current.clear();

    planets.forEach(planet => {
      if (planet.name === 'Sun') return;

      const radius = getPlanetOrbitalRadius(planet.name);
      const geometry = new THREE.RingGeometry(radius - 1, radius + 1, 64);
      const material = new THREE.MeshBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });

      const orbit = new THREE.Mesh(geometry, material);
      orbit.rotation.x = Math.PI / 2;
      orbitLines.current.add(orbit);
    });
  };

  const updateAspects = () => {
    if (!sceneRef.current || !showAspects) return;

    // Clear existing aspects
    aspectLines.current.clear();

    const filteredAspects = aspectFilter === 'all' 
      ? aspects 
      : aspects.filter(aspect => aspect.type === aspectFilter);

    filteredAspects.forEach(aspect => {
      const planet1Mesh = planetMeshes.current.get(aspect.planet1);
      const planet2Mesh = planetMeshes.current.get(aspect.planet2);

      if (planet1Mesh && planet2Mesh) {
        const line = createAspectLine(planet1Mesh.position, planet2Mesh.position, aspect);
        if (line) {
          aspectLines.current.add(line);
        }
      }
    });
  };

  const createAspectLine = (pos1: THREE.Vector3, pos2: THREE.Vector3, aspect: Aspect): THREE.Line | null => {
    const geometry = new THREE.BufferGeometry().setFromPoints([pos1, pos2]);
    
    // Determine line style based on aspect type
    const material = new THREE.LineBasicMaterial({
      color: aspect.color,
      transparent: true,
      opacity: aspect.strength * 0.8,
      linewidth: aspect.strength * 3
    });

    // Add pulsing effect for strong aspects
    if (aspect.strength > 0.7) {
      material.opacity = 0.6 + Math.sin(timeRef.current * 2) * 0.2;
    }

    return new THREE.Line(geometry, material);
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    timeRef.current += 0.01;

    // Animate planets if enabled
    if (isAnimating) {
      planetMeshes.current.forEach((mesh, planetName) => {
        const planet = planets.find(p => p.name === planetName);
        if (planet && planetName !== 'Sun') {
          mesh.rotation.y += planet.speed * rotationSpeed[0] * 0.001;
          
          // Orbital motion
          const currentAngle = (planet.longitude * Math.PI / 180) + (timeRef.current * planet.speed * rotationSpeed[0] * 0.01);
          const radius = getPlanetOrbitalRadius(planetName);
          mesh.position.x = Math.cos(currentAngle) * radius;
          mesh.position.z = Math.sin(currentAngle) * radius;
        }
      });

      // Rotate starfield slowly
      if (starField.current) {
        starField.current.rotation.y += 0.0002;
      }

      // Animate nebula
      if (nebula.current) {
        nebula.current.rotation.z += 0.0001;
      }

      // Camera orbital motion
      if (viewMode === 'cosmic') {
        const cameraAngle = timeRef.current * 0.1;
        cameraRef.current.position.x = Math.cos(cameraAngle) * cameraDistance[0] * 0.3;
        cameraRef.current.position.z = Math.sin(cameraAngle) * cameraDistance[0];
        cameraRef.current.lookAt(0, 0, 0);
      }
    }

    // Update aspects with pulsing effects
    updateAspects();

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationRef.current) return;
    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  const onCanvasClick = (event: MouseEvent) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(Array.from(planetMeshes.current.values()));
    if (intersects.length > 0) {
      const planet = intersects[0].object.userData.planet;
      setSelectedPlanet(planet ? planet.name : null);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    // Add hover effects here if needed
  };

  const cleanup = () => {
    stopAnimation();
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
  };

  const toggleAnimation = () => {
    if (isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
    setIsAnimating(!isAnimating);
  };

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 300, cameraDistance[0]);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const aspectTypes = ['all', 'conjunction', 'opposition', 'trine', 'square', 'sextile'];

  return (
    <div className="w-full">
      {/* Controls Panel */}
      <Card className="cosmic-card mb-4">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Advanced 3D Cosmic Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Animation Controls */}
            <div className="space-y-3">
              <h4 className="font-medium text-purple-300">Animation</h4>
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleAnimation}
                  variant="outline"
                  size="sm"
                  className="border-orange-400"
                >
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAnimating ? 'Pause' : 'Play'}
                </Button>
                <Button
                  onClick={resetCamera}
                  variant="outline"
                  size="sm"
                  className="border-purple-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <label className="text-sm text-gray-300">Speed: {rotationSpeed[0]}x</label>
                <Slider
                  value={rotationSpeed}
                  onValueChange={setRotationSpeed}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="space-y-3">
              <h4 className="font-medium text-purple-300">View Mode</h4>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="cosmic">Cosmic</TabsTrigger>
                  <TabsTrigger value="geometric">Geometric</TabsTrigger>
                  <TabsTrigger value="heliocentric">Solar</TabsTrigger>
                </TabsList>
              </Tabs>
              <div>
                <label className="text-sm text-gray-300">Distance: {cameraDistance[0]}</label>
                <Slider
                  value={cameraDistance}
                  onValueChange={setCameraDistance}
                  max={2000}
                  min={500}
                  step={50}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium text-purple-300">Display</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOrbits}
                    onChange={(e) => setShowOrbits(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Orbital Paths</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showAspects}
                    onChange={(e) => setShowAspects(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Aspect Lines</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showConstellations}
                    onChange={(e) => setShowConstellations(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Star Background</span>
                </label>
              </div>
              <div>
                <label className="text-sm text-gray-300">Aspect Filter</label>
                <select
                  value={aspectFilter}
                  onChange={(e) => setAspectFilter(e.target.value)}
                  className="w-full mt-1 p-1 rounded bg-slate-700 text-white"
                >
                  {aspectTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-600">
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              Planets: {planets.length}
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Aspects: {aspects.length}
            </Badge>
            <Badge variant="outline" className="text-pink-400 border-pink-400">
              Mode: {viewMode.toUpperCase()}
            </Badge>
            {selectedPlanet && (
              <Badge variant="outline" className="text-green-400 border-green-400">
                Selected: {selectedPlanet}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3D Visualization */}
      <Card className="cosmic-card">
        <CardContent className="p-0">
          <div 
            ref={mountRef} 
            className="w-full relative rounded-lg overflow-hidden"
            style={{ height: `${height}px` }}
          />
        </CardContent>
      </Card>

      {/* Selected Planet Info */}
      {selectedPlanet && (
        <Card className="cosmic-card mt-4">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              {selectedPlanet} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const planet = planets.find(p => p.name === selectedPlanet);
              return planet ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-orange-300 text-sm">Position</div>
                    <div className="font-medium">{Math.round(planet.longitude)}°</div>
                  </div>
                  <div>
                    <div className="text-orange-300 text-sm">Distance</div>
                    <div className="font-medium">{planet.distance} AU</div>
                  </div>
                  <div>
                    <div className="text-orange-300 text-sm">Speed</div>
                    <div className="font-medium">{planet.speed}°/day</div>
                  </div>
                  <div>
                    <div className="text-orange-300 text-sm">Color</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: planet.color }}
                      />
                      <span className="text-sm">{planet.color}</span>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}