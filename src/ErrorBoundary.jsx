import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error('AnnSetu UI error:', error);
  }
  render() {
    if (this.state.failed)
      return (
        <main className="loading">
          <section className="panel padded">
            <h1>Let’s reload your workspace.</h1>
            <p>A display error occurred. Your saved records remain in MongoDB.</p>
            <button className="button" onClick={() => window.location.reload()}>
              Reload workspace
            </button>
          </section>
        </main>
      );
    return this.props.children;
  }
}
