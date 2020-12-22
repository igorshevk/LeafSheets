import React from "react";
import { TabProvider, TabConsumer } from "./tabs-context";
import TabItem from "./tab";
import _ from 'lodash';

const ListTabs = ({ children }) => (
  <ul style={{
    paddingLeft: 0,
    listStyle: "none",
    margin: 0
  }}>{ children }</ul>
);

const TabTitleItem = ({ children, innerRef, ...restProps }) => (
  <li 
  ref={innerRef}
  style={{
    display: "inline-block",
    transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
  }} { ...restProps }>{ children }</li>
);

const ActiveTabBorder = ({ activeTabElement, children, ...restProps }) => {
  
  const style = {
    height: 42,
    backgroundColor: "transparent",
    border: "1px solid black",
    borderRadius: 30,
    position: "absolute",
    bottom: 3,
    transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    willChange: "left, width"
  };

  if (activeTabElement) {
    style.width = activeTabElement.offsetWidth;
    style.left = activeTabElement.offsetLeft;
  }

  return (
    <div style={style} { ...restProps }>
      { children }
    </div>
  )
};

const TabAnchorItem = ({ isActiveTab, children, ...restProps}) => {
  const style = {
    textTransform: "capitalize",
    color: "#000000",
    fontFamily: 'Barlow',
    fontSize: 16,
    fontWeight: 500,
    padding: "16px 15px",
    cursor: "pointer",
    opacity: "0.4",
    display: "block",
    textDecoration: "none",
    ":hover": {
      opacity: 1
    }
  }

  if (isActiveTab) {
    style.transition = "all 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms";
    style.cursor = "default";
    style.opacity = 1;
  }

  return (
    <a style={style} {...restProps}>{ children }</a>
  );
};


const TabsContainer = ({ children, ...restProps }) => (
  <div style={{
    position: "relative",
  }}
  { ...restProps }>
    { children }
  </div>
);

const ReactTabs = ({ children, ...restProps }) => (
  <div style={{
    position: "realative"
  }}
  { ...restProps }>
    { children }
  </div>
);

class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.debounceHandleResize = this.debounceHandleResize.bind(this);
  }

  static Tab = TabItem;

  state = {
    tabsElements: [],
    windowWidth: window.innerWidth
  };

  componentDidMount() {
    window.addEventListener('resize', this.debounceHandleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceHandleResize);
  }

  debounceHandleResize = _.debounce(this.handleResize, 100);

  handleResize() {
    this.setState({ windowWidth: window.innerWidth })
  }

  render() {
    return (
      <TabProvider activeTab={this.props.activeTab}>
        <TabConsumer>
          {value => (
            <ReactTabs>
              <TabsContainer>
                <ListTabs>
                  {value.context.tabs.map((tab, index) => (
                    <TabTitleItem
                      key={index}
                      id={tab.id}
                      innerRef={tabElement => {
                        if (!this.state.tabsElements[tab.id]) {
                          this.setState((prevState, props) => {
                            const tabsElements = prevState.tabsElements;
                            tabsElements[tab.id] = tabElement;

                            return {
                              tabsElements
                            };
                          });
                        }
                      }}
                    >
                      <TabAnchorItem
                        isActiveTab={value.context.activeTab.id === tab.id}
                        onClick={value.context.onClick(tab)}
                        onKeyPress={event => {
                          const code = event.keyCode || event.which;

                          if (code === 13) {
                            this.onClick(tab)(event);
                          }
                        }}
                      >
                        {tab.title}
                      </TabAnchorItem>
                    </TabTitleItem>
                  ))}
                </ListTabs>

                <ActiveTabBorder
                  activeTabElement={
                    this.state.tabsElements[value.context.activeTab.id]
                  }
                />
              </TabsContainer>

              {this.props.children}
            </ReactTabs>
          )}
        </TabConsumer>
      </TabProvider>
    );
  }
}

export default Tabs;
