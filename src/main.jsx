/** @jsx b */

import { b, createMachine, memo, mount, emit } from "baahu";

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const C = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
];
const N = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }
  return data;
}

const GlyphIcon = (
  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

const Row = memo(({ selected, id, label }) => {
  return (
    <tr class={selected ? "danger" : ""}>
      <td class="col-md-1">{id}</td>
      <td class="col-md-4">
        <a onClick={() => emit({ type: "SELECT", id: id }, "list")}>{label}</a>
      </td>
      <td class="col-md-1">
        <a onClick={() => emit({ type: "REMOVE", id: id }, "list")}>
          {GlyphIcon}
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  );
});

const List = createMachine({
  id: "list",
  initialState: "default",
  initialContext: () => ({
    data: [],
    selected: void 0,
  }),
  states: {
    default: {
      on: {
        RUN: {
          effects: (ctx) => {
            ctx.data = buildData(1000);
          },
        },
        RUN_LOTS: {
          effects: (ctx) => {
            ctx.data = buildData(10000);
          },
        },
        ADD: {
          effects: (ctx) => {
            Array.prototype.push.apply(ctx.data, buildData(1000));
          },
        },
        UPDATE: {
          effects: (ctx) => {
            for (let i = 0; i < ctx.data.length; i += 10) {
              ctx.data[i].label = ctx.data[i].label + " !!!";
            }
          },
        },
        CLEAR: {
          effects: (ctx) => {
            ctx.data = [];
            ctx.selected = void 0;
          },
        },
        SWAP_ROWS: {
          effects: (ctx) => {
            if (ctx.data.length > 998) {
              let a = ctx.data[1];
              ctx.data[1] = ctx.data[998];
              ctx.data[998] = a;
            }
          },
        },
        SELECT: {
          effects: (ctx, e) => {
            ctx.selected = e.id;
          },
        },
        REMOVE: {
          effects: (ctx, e) => {
            const data = ctx.data;
            for (let i = 0; i < data.length; i++) {
              if (data[i].id === e.id) {
                data.splice(i, 1);
                break;
              }
            }
          },
        },
      },
    },
  },
  render: (_state, ctx) => {
    return (
      <tbody>
        {map(ctx.data, (item) => {
          return (
            <Row
              key={item.id}
              id={item.id}
              label={item.label}
              selected={ctx.selected === item.id}
            />
          );
        })}
      </tbody>
    );
  },
});

const Button = ({ id, type, title }) => {
  return (
    <div class="col-sm-6 smallpad">
      <button
        type="button"
        class="btn btn-primary btn-block"
        id={id}
        onClick={() => {
          emit({ type: type }, "list");
        }}
      >
        {title}
      </button>
    </div>
  );
};

// no need to memo Jumbotron, there's no reason for it to rerender
const Jumbotron = () => {
  return (
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Baahu keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="run" title="Create 1,000 rows" type="RUN" />
            <Button id="runlots" title="Create 10,000 rows" type="RUN_LOTS" />
            <Button id="add" title="Append 1,000 rows" type="ADD" />
            <Button id="update" title="Update every 10th row" type="UPDATE" />
            <Button id="clear" title="Clear" type="CLEAR" />
            <Button id="swaprows" title="Swap Rows" type="SWAP_ROWS" />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div class="container">
      <Jumbotron />
      <table class="table table-hover table-striped test-data">
        <List />
      </table>
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
};

/** naive map util */
function map(arr, projection) {
  const result = Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result.push(projection(arr[i]));
  }
  return result;
}

mount(App, document.getElementById("main"));
