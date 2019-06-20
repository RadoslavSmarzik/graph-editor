import {Component, OnInit} from '@angular/core';
import {fabric} from 'fabric';
import {VertexCommand} from './Commands/vertex-command';
import {Data} from './data';
import {EdgeCommand} from './Commands/edge-command';
import {Multipol4Command} from './Commands/multipol4-command';
import {Multipol3Command} from './Commands/multipol3-command';
import {Multipol2Command} from './Commands/multipol2-command';
import * as $ from 'jquery';
import {Multipol5Command} from './Commands/multipol5-command';
import {Multipol6Command} from './Commands/multipol6-command';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  canvas: any;
  disableStart: Boolean;
  disableStop: Boolean;
  disableUndo: any;
  disableRedo: any;
  vertexName: number;
  disableCode: any;
  className: any;


  ngOnInit(): void {
    this.vertexName = 1;
    this.canvas = new fabric.Canvas('myCanvas');
    this.canvas.selection = false;
    this.disableStart = false;
    this.disableStop = true;

    Data.className = {name: ''};
    Data.state = 0;
    Data.commands = [];
    Data.array_of_multipoles_objects = [];
    Data.canvas = this.canvas;
    Data.vertices_in_graph = [];
    Data.multipoles_in_graph = [];
    Data.edges_in_graph = [];
    Data.vertices_in_graph = [];
    Data.name_of_active_object = null;
    Data.graph_code = null;
    Data.multipoles_for_use = [];
    Data.redoBooelan = {redo: true};
    Data.undoBooelan = {undo: true};
    Data.codeDisable = {disable: true};
    Data.multipolName = 1;

    this.className = Data.className;
    this.disableRedo = Data.redoBooelan;
    this.disableCode = Data.codeDisable;
    this.disableUndo = Data.undoBooelan;

    this.set_selection_on_canvas();
    this.set_mouse_over_on_canvas();
    this.set_mouse_out_on_canvas();

    this.get_multipoles();

  }


  set_mouse_out_on_canvas() {
    this.canvas.on('mouse:out', function (e) {
      if (e.target instanceof fabric.Group) {
        if (e.target.type == 'vertex') {
          e.target.item(1).set('fill', 'transparent');
          this.renderAll();
        }
        if (e.target.type == 'multipol') {
          e.target.item(1).set('fill', 'transparent');
          this.renderAll();
        }

      }
      if (Data.name_of_active_object != null) {
        Data.name_of_active_object.set('fill', 'transparent');
      }
      Data.canvas.remove(Data.label);
      this.renderAll();
    });
  }


  set_mouse_over_on_canvas() {
    this.canvas.on('mouse:over', function (e) {
      if (e.target instanceof fabric.Group) {
        if (e.target.type == 'vertex') {
          e.target.item(1).set('fill', 'black');
          this.renderAll();
        }
        if (e.target.type == 'multipol') {
          e.target.item(1).set('fill', 'black');
          const top = e.e.pageY;
          const left = e.e.pageX;

          Data.label = new fabric.Text(e.target.text_for_label, {
            left: left - 200,
            top: top - 120,
            fill: 'white',
            backgroundColor: 'black',
            height: 12,
            borderColor: 'black',
            fontSize: 25

          });

          Data.canvas.add(Data.label);
          this.renderAll();
        }
        if (e.target.type == 'multipol4' || e.target.type == 'multipol3' || e.target.type == 'multipol2' || e.target.type == 'multipol5' || e.target.type == 'multipol6') {
          e.target.item(0).item(1).set('fill', 'black');
          Data.name_of_active_object = e.target.item(0).item(1);
          this.renderAll();
        }


      }

      if (e.target instanceof fabric.Circle && e.target.type == 'terminal') {
        const top = e.e.pageY;
        const left = e.e.pageX;
        Data.label = new fabric.Text(e.target.name, {
          left: left - 200,
          top: top - 120,
          fill: 'white',
          backgroundColor: 'black',
          height: 12,
          borderColor: 'black',
          fontSize: 25

        });
        Data.canvas.add(Data.label);

      }
    });
  }


  set_selection_on_canvas() {
    this.canvas.on('object:selected', function (e) {
      Data.selectedVertex = e.target;
      if (e.target.type == 'vertex') {
        e.target.item(0).set('fill', '#1E90FF');

      }
      if (e.target.type == 'terminal') {
        e.target.set('fill', '#1E90FF');
      }
      Data.firstVertex = e.target;
    });

    this.canvas.on('selection:cleared', function () {
      if (Data.selectedVertex.type == 'vertex') {
        Data.selectedVertex.item(0).set('fill', Data.selectedVertex.now_color);
      }
      Data.selectedVertex.set('fill', Data.selectedVertex.main_color);
      Data.firstVertex = null;
      Data.secondVertex = null;

    });


    this.canvas.on('selection:updated', function (e) {
      if (Data.selectedVertex.type == 'vertex') {
        Data.selectedVertex.item(0).set('fill', Data.selectedVertex.now_color);
      }
      Data.selectedVertex.set('fill', Data.selectedVertex.main_color);

      const activeObject = e.target;

      Data.selectedVertex = activeObject;

      Data.secondVertex = e.target;
      if ((Data.firstVertex.type == 'vertex' || Data.firstVertex.type == 'terminal') && (Data.secondVertex.type == 'vertex' || Data.secondVertex.type == 'terminal')) {

        let edge = new EdgeCommand(Data.firstVertex, Data.secondVertex);
        edge.execute();
        while (Data.commands.length > Data.state) {
          Data.commands.pop();
        }
        Data.redoBooelan.redo = true;
        Data.commands.push(edge);
        Data.state = Data.commands.length;

      }
      if (activeObject.type == 'vertex') {
        activeObject.item(0).set('fill', '#1E90FF');
      }
      Data.firstVertex = null;
      Data.secondVertex = null;
      Data.firstVertex = e.target;

    });
  }


  add_vertex() {
    this.disableUndo.undo = false;
    this.disableRedo.redo = true;
    const command = new VertexCommand(this.canvas, this.vertexName);
    while (Data.commands.length > Data.state) {
      Data.commands.pop();
    }
    Data.commands.push(command);
    command.execute();
    Data.state = Data.commands.length;
    this.vertexName++;
    Data.codeDisable.disable = true;


  }


  undoMethod(): void {
    Data.commands[Data.state - 1].unexecute();
    Data.state--;
    this.disableRedo.redo = false;
    if (Data.state == 0) {
      this.disableUndo.undo = true;
    }
    Data.codeDisable.disable = true;


  }

  redoMethod(): void {
    this.disableUndo.undo = false;
    this.change_moveable_for_static();
    Data.commands[Data.state].execute();
    Data.state++;
    if (Data.state == Data.commands.length) {
      this.disableRedo.redo = true;
    }
    Data.codeDisable.disable = true;

  }

  change_moveable_for_static() {
    Data.canvas.forEachObject(function (obj) {
      if (obj.type == 'multipol4' || obj.type == 'multipol3' || obj.type == 'multipol2' || obj.type == 'multipol5' || obj.type == 'multipol6') {
        const left = obj.left;
        const top = obj.top;
        let size = Data.array_of_multipoles_objects[obj.name].length - 1;

        for (let i = 0; i < size; i++) {
          obj.item(i).set('positionLeft', left);
          obj.item(i).set('positionTop', top);
          Data.canvas.add(obj.item(i));
        }
        Data.array_of_multipoles_objects[obj.name][0].item(0).set('fill', obj.static_color);
        Data.canvas.remove(obj);
        Data.canvas.renderAll();
      }

    });
  }


  graph_code() {
    alert(Data.graph_code);
  }

  get_multipoles() {
    let index = 0;
    const url = 'http://localhost:8080/multipol';
    $.get(url, function (data, status) {
      if (status == 'success') {
        let scroll_bar = false;
        if (data.length > 4) {
          Data.className.name = 'scrollbar scrollbar-primary';
          scroll_bar = true;
        }

        for (let i = 0; i < data.length; i++) {
          let btn = document.createElement('BUTTON');
          let text = document.createTextNode(data[i]['name']);

          btn.setAttribute('style', 'font-size:13px');
          if (scroll_bar == true) {
            btn.classList.add('small_button');
          }

          btn.appendChild(text);

          document.getElementById('multipoles_buttons').appendChild(btn);


          btn.onclick = function () {
            let multipol;
            let dangling_edges = data[i]['dangling_edges'];
            let type = data[i]['name'];

            if (dangling_edges.length == 2) {
              multipol = new Multipol2Command(Data.multipolName, dangling_edges[0], dangling_edges[1], type);
            }
            if (dangling_edges.length == 3) {
              multipol = new Multipol3Command(Data.multipolName, dangling_edges[0], dangling_edges[1], dangling_edges[2], type);

            }
            if (dangling_edges.length == 4) {
              multipol = new Multipol4Command(Data.multipolName, dangling_edges[0], dangling_edges[1], dangling_edges[2], dangling_edges[3], type);

            }
            if (dangling_edges.length == 5) {
              multipol = new Multipol5Command(Data.multipolName, dangling_edges[0], dangling_edges[1], dangling_edges[2], dangling_edges[3], dangling_edges[4], type);

            }
            if (dangling_edges.length == 6) {
              multipol = new Multipol6Command(Data.multipolName, dangling_edges[0], dangling_edges[1], dangling_edges[2], dangling_edges[3], dangling_edges[4], dangling_edges[5], type);

            }
            Data.multipolName++;
            Data.undoBooelan.undo = false;
            Data.redoBooelan.redo = true;


            while (Data.commands.length > Data.state) {
              Data.commands.pop();
            }
            multipol.execute();
            Data.commands.push(multipol);
            Data.state = Data.commands.length;
            Data.codeDisable.disable = true;

          };
          index++;
        }
      } else {

        alert('error');

      }

    })

      .fail(function () {

        alert('Try refresh');
      });


  }


  graph() {
    const url = 'http://localhost:8080/graph';
    //const url =   "https://jsonplaceholder.typicode.com/posts";
    let data = {'vertices': Data.vertices_in_graph, 'multipoles': Data.multipoles_in_graph, 'edges': Data.edges_in_graph};
    console.log(data);
    console.log(JSON.stringify(data));

    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'text/plain',
      dataType: 'text',
      crossDomain: true,
      success: function (data) {
        Data.graph_code = data;
        Data.codeDisable.disable = false;

      },
      error: function (data) {
        Data.codeDisable.disable = true;
        alert('error');



      }

    });
  /*  $.post(url, JSON.stringify(data), function (data, status) {
      if (status = 'success') {
        console.log(data);
        Data.graph_code = data;
        Data.codeDisable.disable = false;
      }
    })
      .fail(function () {
        alert('error');
      });
*/

  }


  get_invariants() {
    const url = 'http://localhost:8080/invariants';
    let data = Data.graph_code;

    $.get(url, data, function (data, status) {
      if (status == 'success') {
        let result = '';
        $.each(data, function (key, value) {
          result += key.toUpperCase() + ': ' + value + '\n';
        });
        alert(result);

      } else {
        alert('error');
      }

    })

      .fail(function () {
        alert('error');
      })
    ;

    /*
     $.ajax({
      url: url,
      method: 'GET',
      data: data,
      contentType: 'text/plain',
      dataType: 'text',
      crossDomain: true,
      success: function (data) {
        let result = '';
        $.each(data, function (key, value) {
          result += key.toUpperCase() + ': ' + value + '\n';
        });
        alert(result);

      },
      error: function (data) {
        alert('error');



      }

    });
     */

  }


  copy_code() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = Data.graph_code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  download(filename, type) {
    let data = Data.graph_code;
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
    {
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
      var a = document.createElement('a'),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }


}
