import {Command} from './command';
import {fabric} from 'fabric';
import {Data} from '../data';
import {Multipol5Command} from './multipol5-command';

export class Multipol2Command implements Command {
  group: any;
  terminal1: any;
  terminal2: any;
  multipol: any;
  array: any;
  first_time: boolean;
  id: number;
  multipolJS: any;


  constructor(id, name1, name2, type) {
    this.multipolJS = {
      'name': type,
      'id': id.toString(),
    };

    this.id = id;
    this.first_time = true;
    this.array = new Array();
    this.create_center_of_multipol(id, type);
    this.create_dangling_edges(name1, name2);
    this.create_multipol_object();
    this.add_doubleclick_to_static_multipol();
    this.add_doubleclick_to_moveable_multipol();
    this.add_objects_to_global_array();


  }

  create_multipol_object() {
    this.group = new fabric.Group();
    this.group.addWithUpdate(this.multipol);
    this.group.addWithUpdate(this.terminal1);
    this.group.addWithUpdate(this.terminal2);
    this.group.set('type', 'multipol2');
    this.group.set('name', this.id);
    this.group.lockScalingX = true;
    this.group.lockScalingY = true;
    this.group.lockRotation = true;
    this.group.set('static_color', '#7F9900');
    this.group.set('main_color', '#99FF33');
    this.multipol.set('positionLeft', this.group.left);
    this.multipol.set('positionTop', this.group.top);
  }

  add_doubleclick_to_moveable_multipol() {
    this.group.on('mousedblclick', function () {
      const left = this.left;
      const top = this.top;

      for (let i = 0; i < 3; i++) {
        this.item(i).set('positionLeft', left);
        this.item(i).set('positionTop', top);
        Data.canvas.add(this.item(i));
      }
      this.item(0).item(0).set('fill', this.static_color);
      Data.name_of_active_object.set('fill', 'transparent');
      Data.canvas.remove(this);
      Data.canvas.renderAll();
    });
  }

  add_doubleclick_to_static_multipol() {
    this.multipol.on('mousedblclick', function (options) {

      for (let i = 0; i < Data.array_of_multipoles_objects[this.name].length - 1; i++) {
        Data.canvas.remove(Data.array_of_multipoles_objects[this.name][i]);
      }

      Data.array_of_multipoles_objects[this.name][3].set('left', this.positionLeft);
      Data.array_of_multipoles_objects[this.name][3].set('top', this.positionTop);
      this.item(0).set('fill', Data.array_of_multipoles_objects[this.name][3].main_color);
      Data.canvas.add(Data.array_of_multipoles_objects[this.name][3]);

      Data.canvas.remove(Data.label);
      Data.canvas.renderAll();


    });


  }

  create_dangling_edges(terminal1name, terminal2name) {
    this.terminal1 = new fabric.Circle({
      radius: 30,
      fill: 'pink',
      top: 222,
      stroke: 'black',
      left: 30,
      strokeWidth: 5,
      name: terminal1name
    });

    this.terminal2 = new fabric.Circle({
      radius: 30,
      fill: 'pink',
      top: 222,
      stroke: 'black',
      left: 210,
      strokeWidth: 5,
      name: terminal2name
    });
    let terminal1JS = {'type': 'multipol', 'id': this.id.toString(), 'dangling_edge': this.terminal1.name};
    let terminal2JS = {'type': 'multipol', 'id': this.id.toString(), 'dangling_edge': this.terminal2.name};


    this.terminal1.set('representationJS', terminal1JS);
    this.terminal2.set('representationJS', terminal2JS);
  }

  create_center_of_multipol(id, type) {
    let circle = new fabric.Circle({
      radius: 50,
      fill: '#99FF33',
      top: 200,
      left: 100,
      stroke: 'black',
      strokeWidth: 5,
    });

    let text = new fabric.Text(id.toString(), {
      left: circle.left + 42,
      top: circle.top + 27,
      fill: 'transparent'
    });

    if (this.id / 10 >= 1) {
      text.set('left', circle.left + 32);
    }

    this.multipol = new fabric.Group();
    this.multipol.addWithUpdate(circle);
    this.multipol.addWithUpdate(text);
    this.multipol.set('type', 'multipol');
    this.multipol.set('text_for_label', type);
    this.multipol.set('left', 100);
    this.multipol.set('top', 200);
    this.multipol.set('name', this.id);
    this.multipol.lockMovementX = true;
    this.multipol.lockMovementY = true;
  }

  add_objects_to_global_array() {
    this.array[0] = this.multipol;
    this.array[1] = this.terminal1;
    this.array[2] = this.terminal2;
    this.array[3] = this.group;

    Data.array_of_multipoles_objects[this.id] = this.array;
    for (let i = 1; i < 3; i++) {
      this.array[i].set('positionLeft', this.group.left);
      this.array[i].set('positionTop', this.group.top);
      this.array[i].set('main_color', 'pink');
      this.array[i].set('type', 'terminal');
      this.array[i].set('edges', 0);
      this.array[i].set('multipol', this.id);
      this.array[i].lockMovementX = true;
      this.array[i].lockMovementY = true;
      this.array[i].set('multipol_type', 'multipol2');
    }

  }


  execute() {
    if (this.first_time) {
      Data.canvas.add(this.group);
      this.first_time = false;
    } else {
      Data.array_of_multipoles_objects[this.multipol.name][3].set('left', this.multipol.positionLeft);
      Data.array_of_multipoles_objects[this.multipol.name][3].set('top', this.multipol.positionTop);

      for (let i = 0; i < Data.array_of_multipoles_objects[this.group.name].length - 1; i++) {
        Data.canvas.add(Data.array_of_multipoles_objects[this.group.name][i]);
      }
      this.multipol.item(0).set('fill', this.group.static_color);
    }
    Data.multipoles_in_graph.push(this.multipolJS);
  }


  unexecute() {
    Data.canvas.remove(this.group);
    const left = this.group.left;
    const top = this.group.top;

    for (let i = 0; i < 3; i++) {
      this.group.item(i).set('positionLeft', left);
      this.group.item(i).set('positionTop', top);
    }

    for (var i = 0; i < Data.array_of_multipoles_objects[this.group.name].length - 1; i++) {
      Data.canvas.remove(Data.array_of_multipoles_objects[this.group.name][i]);
    }
    let index = Data.multipoles_in_graph.indexOf(this.multipolJS);
    Data.multipoles_in_graph.splice(index, 1);

  }


}
