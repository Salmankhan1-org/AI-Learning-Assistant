import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col justify-center items-center bg-[#f8fafc] p-5"
        >
          <div className="bg-white p-7.5 rounded-xl shadow-md max-w-150 text-center"
          >
            <h2 className="text-[#dc2626] mb-2.5" >
              Something went wrong
            </h2>

            <p className="text-[#64748b] mb-5"  >
              An unexpected error occurred. Please try again.
            </p>

            {import.meta.env.VITE_REACT_ENV === "development" && this.state.error && (
              <details className="text-left bg-[#f1f5f9] p-4 rounded-lg mb-5 overflow-auto "
                
              >
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                  Error Details
                </summary>
                <pre className="text-sm">
                  {this.state.error.toString()}
                  {"\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-2.5 justify-center" >
              <button
                onClick={this.handleReload}
                className="px-2.5 py-4 rounded-lg border-none cursor-pointer bg-[#2563eb] text-white" 
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-2.5 py-4 rounded-lg border border-[#cbd5e1] cursor-pointer text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
