import React, { useEffect, useRef } from 'react';

import Context from './global/Context';
import Model from './model/Model';
import View from './view/View';
import Controller from './controller/Controller';

function App() {
  let context;

  let model;
  let view;
  let controller;

  const canvasRef = useRef(null);

  function handleClick(event) {
    if (controller) {
      controller.handleClick(event);
    }
  }

  useEffect(() => {
    (async () => {
      context = await Context.getInstance();
      model = new Model(context);
      view = new View(context, canvasRef.current);
      controller = new Controller(context);

      controller.model = model;
      controller.view = view;

      model.view = view;

      view.controller = controller;
      view.render();
    })();
  }, []);

  return (
    <canvas id="gpu-canvas" ref={canvasRef} onClick={handleClick} />
  );
}

export default App;
