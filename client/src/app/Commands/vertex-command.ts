import {fabric} from 'fabric';
import {Command} from './command';
import {Data} from '../data';


export class VertexCommand implements Command {
  canvas: any;
  circle: any;
  text: any;
  group: any;
  vertexJS: any;
  id: number;

  constructor(canvas, id) {
    this.id = id;
    this.vertexJS = {'type': 'vertex', 'id': id.toString()};
    this.canvas = canvas;
    this.create_vertex();
  }

  create_vertex() {
    this.circle = new fabric.Circle({
      radius: 30,
      fill: 'red',
      top: 100,
      left: 100,
      stroke: 'black',
      name: this.id.toString(),
      strokeWidth: 5,

    });

    this.circle.set('main_color', 'red');
    this.text = new fabric.Text(this.id.toString(), {
      left: this.circle.left + 22,
      top: this.circle.top + 7,
      fill: 'transparent'
    });
    if (this.id / 10 >= 1) {
      this.text.set('left', this.circle.left + 12);
    }

    this.group = new fabric.Group([this.circle, this.text], {
      left: 100,
      top: 100,
      name: this.id.toString(),
    });

    this.group.lockScalingX = true;
    this.group.lockScalingY = true;
    this.group.lockRotation = true;
    this.group.set('type', 'vertex');
    this.group.set('edges', 0);
    this.group.set('representationJS', this.vertexJS);
    this.group.set('static_color', '#B31B00');
    this.group.set('main_color', 'red');
    this.group.set('now_color', 'red');

  }


  execute() {
    this.canvas.add(this.group);
    this.canvas.moveTo(this.group, 100);
    Data.vertices_in_graph.push(this.id.toString());

  }

  unexecute() {
    this.canvas.remove(this.group);

    let index = Data.vertices_in_graph.indexOf(this.id);
    Data.vertices_in_graph.splice(index, 1);

  }


}

