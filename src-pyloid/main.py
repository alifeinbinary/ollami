from pyloid import (
    TrayEvent,
)
from pyloid.utils import (
    get_production_path,
    is_production,
)
from pyloid.serve import pyloid_serve
from pyloid import Pyloid
from rpc import rpc
import subprocess
import time
import os
import signal
import atexit
import socket
import shutil

app = Pyloid(app_name="Ollami", single_instance=True)

# Global variable to track the Node.js server process
node_server_process = None


def cleanup_node_server():
    """Clean up the Node.js server process on app exit"""
    global node_server_process
    if node_server_process:
        try:
            node_server_process.terminate()
            node_server_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            node_server_process.kill()
        except Exception as e:
            print(f"Error cleaning up Node server: {e}")


def is_port_available(port):
    """Check if a port is available"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("localhost", port))
            return True
        except OSError:
            return False


def wait_for_server(port, timeout=30):
    """Wait for the Node.js server to be ready"""
    start_time = time.time()
    while time.time() - start_time < timeout:
        if not is_port_available(port):
            return True
        time.sleep(0.5)
    return False


def find_node_executable():
    """Find the Node.js executable path"""
    # First, check for bundled Node.js runtime
    if is_production():
        bundled_node_paths = [
            get_production_path("runtime/node"),  # Custom runtime folder
            get_production_path("node/bin/node"),  # Node.js distribution structure
            get_production_path("bin/node"),  # Simple bin folder
        ]

        for path in bundled_node_paths:
            if os.path.isfile(path) and os.access(path, os.X_OK):
                return path

    # Try common Node.js executable names in system PATH
    node_names = ["node", "nodejs"]

    for name in node_names:
        # Use shutil.which to find the executable in PATH
        node_path = shutil.which(name)
        if node_path:
            return node_path

    # If not found in PATH, try common installation paths
    common_paths = [
        "/usr/local/bin/node",
        "/opt/homebrew/bin/node",  # Homebrew on Apple Silicon
        "/usr/bin/node",
        "/usr/local/nodejs/bin/node",
        os.path.expanduser("~/.nvm/versions/node/*/bin/node"),  # NVM installations
    ]

    for path in common_paths:
        if "*" in path:
            # Handle glob patterns for NVM
            import glob

            matches = glob.glob(path)
            if matches:
                # Use the first match (could be improved to find latest version)
                return matches[0]
        elif os.path.isfile(path) and os.access(path, os.X_OK):
            return path

    return None


# Register cleanup function
atexit.register(cleanup_node_server)

if is_production():
    app.set_icon(get_production_path("src-pyloid/icons/icon.png"))
    app.set_tray_icon(get_production_path("src-pyloid/icons/icon.png"))
else:
    app.set_icon("src-pyloid/icons/icon.png")
    app.set_tray_icon("src-pyloid/icons/icon.png")


############################## Tray ################################
def on_double_click():
    app.show_and_focus_main_window()


app.set_tray_actions(
    {
        TrayEvent.DoubleClick: on_double_click,
    }
)
app.set_tray_menu_items(
    [
        {"label": "Show Window", "callback": app.show_and_focus_main_window},
        {"label": "Exit", "callback": app.quit},
    ]
)
####################################################################

if is_production():
    # Find an available port (default 3000, fallback to others)
    server_port = 3000
    for port in range(3000, 3010):
        if is_port_available(port):
            server_port = port
            break

    try:
        # Find Node.js executable
        node_executable = find_node_executable()
        if not node_executable:
            raise FileNotFoundError(
                "Node.js executable not found. Please ensure Node.js is installed."
            )

        print(f"Using Node.js executable: {node_executable}")

        # Set environment variables for the Node.js server
        env = os.environ.copy()
        env["PORT"] = str(server_port)
        env["HOST"] = "127.0.0.1"

        # Start the Node.js server
        node_server_path = get_production_path("dist-node/index.js")
        print(f"Starting Node.js server on port {server_port}...")

        node_server_process = subprocess.Popen(
            [node_executable, node_server_path],
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=get_production_path("."),
        )

        # Wait for server to be ready
        if wait_for_server(server_port):
            print(f"Node.js server started successfully on port {server_port}")
            server_url = f"http://127.0.0.1:{server_port}"
        else:
            print("Failed to start Node.js server, falling back to error page")
            server_url = (
                "data:text/html,<h1>Error: Could not start SvelteKit server</h1>"
            )

    except Exception as e:
        print(f"Error starting Node.js server: {e}")
        server_url = f"data:text/html,<h1>Error starting server: {e}</h1>"

    window = app.create_window(
        title="Ollami",
        dev_tools=False,
        rpc=rpc,
    )
    window.load_url(server_url)
else:
    window = app.create_window(
        title="Ollami [dev]",
        dev_tools=True,
        rpc=rpc,
    )
    window.load_url("http://localhost:5173")

window.show_and_focus()

app.run()
