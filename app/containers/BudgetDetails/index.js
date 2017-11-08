// @flow
import * as React from 'react';
import BudgetDetails from 'components/BudgetDetails';
import { connect } from 'react-redux';
import { getTransactionById, getOutflowBalance, getInflowBalance } from 'selectors/transactions';
import type { Transaction } from 'modules/transactions';
import transactionReducer from 'modules/transactions';
import categoryReducer from 'modules/categories';
import { injectAsyncReducers } from 'store';


injectAsyncReducers({
  transactions: transactionReducer,
  categories: categoryReducer,
});

const mapDispatchToProps = (dispatch: *, ownProps) => ({
  //Using redux-observable you can keep track of history actions and apply functional operators, for now, I'm going to use a direct function
  // goBack: () => dispatch({
  //   type: "GO_BACK"
  // })
  goBack: () => ownProps.history.goBack()

});
const mapStateToProps = (state, ownProps) => {
  const transaction: Transaction = getTransactionById(state, ownProps.match.params.id)
  const totalTransactions: number = Math.abs(getOutflowBalance(state)) + Math.abs(getInflowBalance(state))
  const percentage: number = (transaction.value / totalTransactions) * 100


  /*
  itemPercentage: string,
    itemValue: string,
    itemTitle: string,
    isOutflow: boolean,
    total: number,
  */
  return {
    itemTitle: transaction.description,
    itemPercentage: Math.abs(percentage).toFixed(2),
    itemValue: transaction.value,
    isOutflow: percentage < 0,
    total: totalTransactions
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetDetails);
