import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import Expo from 'expo';

export default class App extends React.Component {
  render() {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={(evt) => this.handlePress(evt) } >
        <View style={styles.container}>
          <Text style={styles.titleText}>Welcome!</Text>
          {this.state.isCubeShowing && (
            <Text>Tap on the cube to change color!</Text>
          )}
        </View>
        <Expo.GLView
          style={{ height: 500 }}
          onContextCreate={this.createCube}
          ref={(ref) => this._glView = ref}>
        </Expo.GLView>
        <Button title={this.generateTitle()} onPress={this.onPressButton}></Button>
      </TouchableOpacity>
    );
  }

  constructor(props) {
    super(props);
    this.createCube = this.createCube.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.state = { isCubeShowing: false };
  }

  generateTitle(){
    if(this.state.isCubeShowing){
      return "Hide Cube"
    }
    return "Show Cube"
  }


  createCube = async(gl) => {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    this.renderer = ExpoTHREE.createRenderer({ gl });
    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.camera.position.z = 5;
    this.renderer.render(this.scene, this.camera);
    this.gl = gl;  
  }

  onPressButton(){
    if(this.state.isCubeShowing){
      this.removeCube();
    }
    else{
      this.addCube();
    }
  }

  removeCube(){
    const cube = this.scene.getObjectByName("cube");
    this.scene.remove(cube);

    this.setState({
      isCubeShowing: false, 
    });

  }

  addCube(){
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "cube";
    cube.callback = function(){

    };
    this.scene.add(cube);

    this.setState({
      isCubeShowing: true,
    });
    
    const animate = () => {
      cube.rotation.x += 0.07;
      cube.rotation.y += 0.04;

      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
      this.gl.endFrameEXP();
    }
    animate();
  }
  
  handlePress(event){

    if(this.state.isCubeShowing){
      const mouse = new THREE.Vector3();
      const raycaster = new THREE.Raycaster();

      const {height, width} = Dimensions.get('window');

      mouse.x = 2*(event.nativeEvent.locationX/width) - 1;
      mouse.y = 2*(event.nativeEvent.locationY/height) - 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children);

      if(intersects.length > 0){
        intersects[0].object.material.color.setHex( Math.random() * 0xffffff );
      }
    }
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
