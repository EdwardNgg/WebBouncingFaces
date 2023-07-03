import React, { useEffect, useRef } from 'react';

import Context from './Context';

function App() {
  let context;
  const canvasRef = useRef(null);

  useEffect(() => {
    (async () => {
      context = await Context.getInstance(canvasRef.current);
      context.render();
    })();
  }, []);

  return (
    <canvas id="gpu-canvas" ref={canvasRef} />
  );
}

export default App;
