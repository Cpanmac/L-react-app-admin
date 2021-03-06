import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import * as Actions from '../../actions'
import Head from './Head'
import {renderRoutes} from 'react-router-config'
import {isLogin} from '../../utils/auth.util'
import {Layout} from 'antd';
const {Content, Footer} = Layout;
import Side from './Side'




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
// let isMobile;
// enquireScreen((b) => {
//   isMobile = b;
// });

class LayoutComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      isMobile:false
    };
  }



  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  static propTypes = {
    route: PropTypes.object.isRequired,
    history: PropTypes.object,
    auth: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    globalVal: PropTypes.object.isRequired,
    document: PropTypes.object,
      collapsed: PropTypes.bool
  }
  componentDidMount() {
    let enquireJs;
    if (typeof window !== 'undefined') {
      const matchMediaPolyfill = mediaQuery => {
        return {
          media: mediaQuery,
          matches: false,
          addListener() {
          },
          removeListener() {
          },
        };
      };
      window.matchMedia = window.matchMedia || matchMediaPolyfill;
      enquireJs = require('enquire.js');
    }

    enquireJs.register('only screen and (max-width: 767.99px)', {
      match: () => {
        this.setState({
          isMobile:true
        })
      },
      unmatch: () => {
        this.setState({
          isMobile:false
        })
      },
    });

  }
  componentWillMount() {

    if (!isLogin()) {
      try {
        window.location.href = '/login'
      } catch (err) {
        // console.log('忽略服务端渲染,组件检查的时候window is not defined')
      }

    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  static fetchData({token}){
    console.log('Layout中fetchData')
    return [Actions.getUserInfo(token)]
  }

  handleMenuCollapse = (collapsed) => {
    this.props.actions.handleMenuCollapse(collapsed)
  }


  render() {

    return (
      <Layout>
        <Side
            collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.toggle}
          isMobile={this.state.isMobile}
        />
        <Layout>
          <Head
            onToggle={this.toggle}
            isMobile={this.state.isMobile}
            collapsed={this.state.collapsed}

          />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {renderRoutes(this.props.route.routes)}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            L-react-app-admin ©2018 Created by lovelife10000 github:<a href="https://github.com/lovelife10000/L-react-app-admin">https://github.com/lovelife10000/L-react-app-admin</a>
          </Footer>
        </Layout>
      </Layout>

    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LayoutComp))