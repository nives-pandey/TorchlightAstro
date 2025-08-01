// Simple test app to verify deployment
export default function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟 Torchlight Astrology</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Deployment Test - React App Loading Successfully
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        backdropFilter: 'blur(10px)'
      }}>
        <p>✅ React is working</p>
        <p>✅ Vite build complete</p>
        <p>✅ Server running on port 5000</p>
        <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: '0.8' }}>
          Current time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}