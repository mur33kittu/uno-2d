import React, { createRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Card } from "../card";
import { mapCoordinateToCard, getRandomInt } from "../../utilities";
import { ALL_CARD_NAMES, COORDINATES } from "./constants";
import YourRegion from "../region/YourRegion/YourRegion";

class BaseScene extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.players = 0;
    this.playCards = 0;
    this.storeCards = [];
    this.state = {
      saveCards: []
    };
    this.cardRef = createRef(); // number of cards per hand
    this.playerRef = createRef(); // number of players
  }

  componentDidMount = () => {
    this.generateCssBackgroundSize();
  };

  generateCards = () => {
    let storeCards = [];
    const totalNumberOfCards = this.playerRef.current.value * this.cardRef.current.value;

    // only add unique cards
    while (storeCards.length < totalNumberOfCards) {
      const randInt = getRandomInt(0, ALL_CARD_NAMES.length - 1);
      const randCardName = ALL_CARD_NAMES[randInt];
      if (!storeCards.includes(randCardName)) {
        storeCards.push(randCardName);
      }
    }

    this.setState({
      saveCards: storeCards,
      playCards: this.cardRef.current.value
    });
  };

  generateCssBackgroundSize = () => {
    COORDINATES.forEach(coordinate => {
      const id = mapCoordinateToCard(coordinate.y, coordinate.x);
      this.storeCards[id] = {
        id: id,
        card: <Card x={coordinate.x * 100} y={coordinate.y * 150} />
      };
    });
  };

  // This is a required callback
  onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newCardIds = [...this.state.saveCards];
    newCardIds.splice(source.index, 1);
    newCardIds.splice(destination.index, 0, draggableId);

    this.setState({
      saveCards: newCardIds
    });
  };

  render = () => (
    <div>
      Enter Number of Cards: <input type="text" id="cards" ref={this.cardRef} />
      Enter Number of Players: <input type="text" id="players" ref={this.playerRef} />
      <button onClick={this.generateCards}>Generate</button>
      <br />
      <DragDropContext onDragEnd={this.onDragEnd}>
        <YourRegion yourCards={this.state.saveCards} allCards={this.storeCards}></YourRegion>
      </DragDropContext>
    </div>
  );
}

export default BaseScene;
