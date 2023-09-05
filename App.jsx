import React, {useState} from 'react';
import {
  Alert,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Parse from 'parse/react-native.js';
import {
  List,
  Title,
  IconButton,
  Text as PaperText,
  Button as PaperButton,
  TextInput as PaperTextInput,
} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

Parse.serverURL = 'https://parseapi.back4app.com/';
//Before using the SDK...
Parse.setAsyncStorage(AsyncStorage);
//Paste below the Back4App Application ID AND the JavaScript KEY
Parse.initialize('PZX9Sa3PH0SBPzfXKL9n0LcY2nZGVvSydw43cU8f', '4ULZtgthvFKwRdiIl33EN2U0ZyqNsdCRL5hqkH7J');
//Point to Back4App Parse API address 


  
  

export default function App() {
  const [readResults, setReadResults] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
    const createTodo = async function () {

    const newTodoTitleValue = newTodoTitle;
    let Todo = new Parse.Object('Todo');
    Todo.set('title', newTodoTitleValue);
    Todo.set('done', false);
    try {
      await Todo.save();
      Alert.alert('Success!', 'Todo created!');
      readTodos();
      return true;
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    };
  };

  const readTodos = async function () {
    const parseQuery = new Parse.Query('Todo');
    try {
      let todos = await parseQuery.find();
      setReadResults(todos);
      return true;
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    };
  };

  const updateTodo = async function (todoId, done) {
    let Todo = new Parse.Object('Todo');
    Todo.set('objectId', todoId);
    Todo.set('done', done);
    try {
      await Todo.save();
      Alert.alert('Success!', 'Todo updated!');
      readTodos();
      return true;
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    };
  };

  const deleteTodo = async function (todoId) {
    const Todo = new Parse.Object('Todo');
    Todo.set('objectId', todoId);
    try {
      await Todo.destroy();
      Alert.alert('Success!', 'Todo deleted!');
      readTodos();
      return true;
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    };
  };
  return (
    <>
      <StatusBar backgroundColor="#208AEC" />
      <SafeAreaView style={Styles.container}>
        <View style={Styles.header}>
          <Image
            style={Styles.header_logo}
            source={ {
              uri:
                'https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png',
            } }
          />
          <PaperText style={Styles.header_text_bold}>
            {'React Native on Back4App'}
          </PaperText>
          <PaperText style={Styles.header_text}>{'Product Creation'}</PaperText>
        </View>
        <View style={Styles.wrapper}>
          <View style={Styles.flex_between}>
            <Title>Todo List</Title>
            {/* Todo read (refresh) button */}
            <IconButton
              icon="refresh"
              color={'#208AEC'}
              size={24}
              onPress={() => readTodos()}
            />
          </View>
          <View style={Styles.create_todo_container}>
            {/* Todo create text input */}
            <PaperTextInput
              value={newTodoTitle}
              onChangeText={text => setNewTodoTitle(text)}
              label="New Todo"
              mode="outlined"
              style={Styles.create_todo_input}
            />
            {/* Todo create button */}
            <PaperButton
              onPress={() => createTodo()}
              mode="contained"
              icon="plus"
              color={'#208AEC'}
              style={Styles.create_todo_button}>
              {'Add'}
            </PaperButton>
          </View>
          <ScrollView>
            {/* Todo read results list */}
            {readResults !== null &&
              readResults !== undefined &&
              readResults.map((todo) => (
                <List.Item
                  key={todo.id}
                  title={todo.get('title')}
                  titleStyle={
                    todo.get('done') === true
                      ? Styles.todo_text_done
                      : Styles.todo_text
                  }
                  style={Styles.todo_item}
                  right={props => (
                    <>
                      {/* Todo update button */}
                      {todo.get('done') !== true && (
                        <TouchableOpacity
                          onPress={() => updateTodo(todo.id, true)}>
                          <List.Icon
                            {...props}
                            icon="check"
                            color={'#4CAF50'}
                          />
                        </TouchableOpacity>
                      )}
                      {/* Todo delete button */}
                      <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                        <List.Icon {...props} icon="close" color={'#ef5350'} />
                      </TouchableOpacity>
                    </>
                  )}
                />
              ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

// These define the screen component styles
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  wrapper: {
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#208AEC',
  },
  header_logo: {
    width: 170,
    height: 40,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  header_text_bold: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header_text: {
    marginTop: 3,
    color: '#fff',
    fontSize: 14,
  },
  flex_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  create_todo_container: {
    flexDirection: 'row',
  },
  create_todo_input: {
    flex: 1,
    height: 38,
    marginBottom: 16,
    backgroundColor: '#FFF',
    fontSize: 14,
  },
  create_todo_button: {
    marginTop: 6,
    marginLeft: 15,
    height: 40,
  },
  todo_item: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
  },
  todo_text: {
    fontSize: 15,
  },
  todo_text_done: {
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
});


