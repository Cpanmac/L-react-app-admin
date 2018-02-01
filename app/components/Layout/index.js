import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Footer from '../Footer/footer'
import * as Actions from '../../actions'
import Header from '../Header'
import Sidebar from '../Sidebar'
import {renderRoutes} from 'react-router-config'
import {isLogin} from '../../utils/auth.util'


const mapStateToProps = state => {
  return {
    auth: state.auth.toJS(),
    globalVal: state.globalVal.toJS(),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}


class Layout extends Component {
  constructor(props) {
    super(props)
  }
  static fetchData({token}){
    console.log('Layout中fetchData')
    return [Actions.getUserInfo(token)]
  }

  static propTypes = {
    route: PropTypes.object.isRequired,
    history: PropTypes.object,
    auth: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    globalVal: PropTypes.object.isRequired,
    document:PropTypes.object,
  }
  componentWillMount(){

    if(!isLogin()) {
      try {
        window.location.href='/login'
      }catch (err){
        // console.log('忽略服务端渲染,组件检查的时候window is not defined')
      }

    }
  }


  render() {
    // const { actions,showmsg } = this.props
    return (
      <div>
        <Header />
        <Sidebar />
        {renderRoutes(this.props.route.routes)}
        <Footer />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))