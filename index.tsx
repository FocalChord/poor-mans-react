const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props);
    }
    const element = { tag, props: { ...props, children } };

    return element;
  },
};

const render = (reactElement, container) => {
  // Recursively start at the root and render each element

  // Render the body of the element
  if (["string", "number"].includes(typeof reactElement)) {
    container.appendChild(document.createTextNode(String(reactElement)));
    return;
  }

  const actualDomElement = document.createElement(reactElement.tag);
  if (reactElement.props) {
    Object.keys(reactElement.props)
      .filter((p) => p !== "children")
      .forEach((p) => (actualDomElement[p] = reactElement.props[p]));
  }

  if (reactElement.props.children) {
    reactElement.props.children.forEach((childNode) =>
      render(childNode, actualDomElement)
    );
  }

  container.appendChild(actualDomElement);
};

const rerender = () => {
  // Reset after re-render

  stateCursor = 0;

  document.querySelector("#app").firstChild.remove();
  render(<App />, document.querySelector("#app"));
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
  const frozenCursor = stateCursor;

  states[frozenCursor] = states[frozenCursor] || initialState;

  const setState = (newState) => {
    states[frozenCursor] = newState;
    rerender();
  };

  stateCursor++;

  return [states[frozenCursor], setState];
};

const App = () => {
  const [name, setName] = useState("name");
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <p>Your name is : {name}</p>
        <input value={name} onchange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <p> Count: {count} </p>
        <button onclick={() => setCount(count + 1)}> + </button>
        <button onclick={() => setCount(count - 1)}> - </button>
      </div>
    </div>
  );
};

render(<App />, document.querySelector("#app"));
