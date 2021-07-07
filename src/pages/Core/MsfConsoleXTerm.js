import React from 'react';
import { Terminal } from 'xterm';
import './xterm.css';

class MsfConsoleXTerm extends React.Component {
  constructor(props) {
    super(props);
    this.terminalRef = React.createRef();
    this.terminal = new Terminal({
      allowTransparency: true,
      useStyle: true,
      cursorBlink: true,
    });
  }


  componentDidMount() {
    if (this.terminalRef.current) {
      // Creates the terminal within the container element.
      this.terminal.open(this.terminalRef.current);

    }
  }

  componentWillUnmount() {
    // When the component unmounts dispose of the terminal and all of its listeners.
    this.terminal.dispose();
  }

  render() {
    return <div
      ref={this.terminalRef}/>;
  }

}

// const MsfConsoleXTerm = () => {
//   const xtermRef = React.useRef(new Terminal({
//     allowTransparency: true,
//     useStyle: true,
//     cursorBlink: true,
//   }))
//   const fitAddon = new FitAddon();
//
//   useEffect(() => {
//     // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
//     xtermRef.current.terminal.writeln("Hello, World!")
//   }, [])
//
//   useEffect(() => {
//     // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
//
//     fitAddon.fit();
//   }, [])
//
//
//   return (
//     // Create a new terminal and set it's ref.
//     <XTerm
//       ref={xtermRef}
//       addons={[fitAddon]}
//       className={styles.msfxterm}
//     />
//   )
// }


export default MsfConsoleXTerm;
