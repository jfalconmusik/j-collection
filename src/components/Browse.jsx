import React from "react";
import Amplify, {
  Analytics,
  Storage,
  API,
  graphqlOperation,
  S3Album,
} from "aws-amplify";

// for graphQL
const listTodos = `query listTodos {
    listTodos{
      items{
        id
        name
        description
      }
    }
  }`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
    createTodo(input:{
      name:$name
      description:$description
    }){
      id
      name
      description
    }
  }`;

const Browse = () => {
  const todoMutation = async () => {
    const todoDetails = {
      name: "Party tonight!",
      description: "Amplify CLI rocks!",
    };

    const newEvent = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newEvent));
  };

  const listQuery = async () => {
    console.log("listing todos");
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  };

  const post = async () => {
    console.log("calling api");
    const response = await API.post("myapi", "/items", {
      body: {
        id: "1",
        name: "hello amplify!",
      },
    });
    alert(JSON.stringify(response, null, 2));
  };
  const get = async () => {
    console.log("calling api");
    const response = await API.get("myapi", "/items/object/1");
    alert(JSON.stringify(response, null, 2));
  };
  const list = async () => {
    console.log("calling api");
    const response = await API.get("myapi", "/items/1");
    alert(JSON.stringify(response, null, 2));
  };

  return (
    <div className="Browse">
      <p> Pick a file</p>
      <input type="file" onChange={this.uploadFile} />
      <button onClick={this.listQuery}>GraphQL Query</button>
      <button onClick={this.todoMutation}>GraphQL Mutation</button>
      <button onClick={this.post}>POST</button>
      <button onClick={this.get}>GET</button>
      <button onClick={this.list}>LIST</button>
      <S3Album level="private" path="" />
    </div>
  );
};
