import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}
    >
        <h1>
            Hello from React
        </h1>
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'))

module.hot.accept()
