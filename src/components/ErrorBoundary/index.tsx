import { Component, type ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(_error: unknown) {}

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg-gray p-4 text-center">
          <h1 className="mb-4 font-fixel-display text-4xl text-primary">Oops!</h1>
          <p className="mb-8 max-w-md text-secondary text-xl">
            Something went wrong while rendering the application. Please try refreshing the page or
            contact support if the issue persists.
          </p>
          <button type="button" onClick={this.handleReload}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
