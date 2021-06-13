import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import db from '../config';

export default class Searchscreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null

    }
  }

  componentDidMount = async () => {
    const query = await db.collection("transactions").get()
    query.docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],

      })
    })
  }

  /*
  componentDidMount = async ()=>{
    const query = await db.collection("transactions").limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions: [],
        lastVisibleTransaction: doc
      })
    })
  }*/

  fetchMoreTransactions = async () => {
    const query = await db.collection("transactions").startAfter(this.state.lastVisibleTransaction).limit(10).get()
    query.docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc
      })
    })
  }


  render() {
    return (
      /*  <ScrollView>
          {
            this.state.allTransactions.map((transaction, index)=>{
              return(
                <View key = {index} style={{borderBottomWidth: 2}}>
                <Text>{"Book Id: " + transaction.bookId}</Text>
                <Text>{"Student id: " + transaction.studentId}</Text>
                <Text>{"Transaction Type: " + transaction.transactionType}</Text>
                <Text>{"Date: " + transaction.date.toDate()}</Text>
              </View>
              )
            })
          }
        </ScrollView>
        */

      <FlatList
        data={this.state.allTransactions}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 2 }}>
            <Text>{"Book Id: " + item.bookId}</Text>
            <Text>{"Student id: " + item.studentId}</Text>
            <Text>{"Transaction Type: " + item.transactionType}</Text>
            <Text>{"Date: " + item.date.toDate()}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.fetchMoreTransactions}
        onEndReachedThreshold={0.7}

      />
    );
  }
}