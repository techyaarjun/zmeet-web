// class RawWebSockets {
//   constructor(connectionString) {
//     this.socket = new WebSocket(connectionString);
//     this._registerDefaultCallbacks();
//   }

//   _registerDefaultCallbacks() {
//     this.socket.onopen = () => {
//       console.log("WebSocket connection established.");
//       this.socket.send("Hello, World!");
//     };

//     this.socket.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//     this.socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     this.socket.onmessage = (event) => {
//       console.log("Message received:", event.data);
//     };
//   }

//   _onOpen(callback) {
//     this.socket.onopen = callback;
//   }

//   _onClose(callback) {
//     this.socket.onclose = callback;
//   }

//   _onError(callback) {
//     this.socket.onerror = callback;
//   }

//   _onMessage(callback) {
//     this.socket.onmessage = callback;
//   }

//   _send(message) {
//     this.socket.send(message);
//   }

//   _close() {
//     this.socket.close();
//   }

//   _isOpen() {
//     return this.socket.readyState === WebSocket.OPEN;
//   }

//   _isClosed() {
//     return this.socket.readyState === WebSocket.CLOSED;
//   }
// }

class PeerConnection {
  constructor(userID) {
    this.userID = userID;
    this.iceConnected = false;
    this.connectionState = false;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    this._registerDefaultCallbacks();
  }

  _registerDefaultCallbacks() {
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(
        `ICE Connection State Changed: ${this.peerConnection.iceConnectionState}`
      );
      if (this.peerConnection.iceConnectionState === "connected") {
        this.iceConnected = true;
      }
    };

    this.peerConnection.onsignalingstatechange = () => {
      console.log(
        `Signaling State Changed: ${this.peerConnection.signalingState}`
      );
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log(
        `Connection State Changed: ${this.peerConnection.connectionState}`
      );
      if (this.peerConnection.connectionState === "connected") {
        this.connectionState = true;
      }
    };

    this.peerConnection.onicecandidate = async (event) => {
      console.log("ICE Candidate:", event);

      const response = await fetch(
        `/api/v1/handshake/ice-candidate/${this.userID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event.candidate),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to send answer. HTTP Status: ${response.status}`
        );
      }
    };
  }

  _peerConnection() {
    return this.peerConnection;
  }

  _createOffer() {
    return this.peerConnection.createOffer();
  }

  _createAnswer() {
    return this.peerConnection.createAnswer();
  }

  _setLocalDescription(description) {
    return this.peerConnection.setLocalDescription(description);
  }

  _setRemoteDescription(description) {
    return this.peerConnection.setRemoteDescription(description);
  }

  _onIceConnectionStateChange(callback) {
    this.peerConnection.oniceconnectionstatechange = callback;
  }

  _onSignalingStateChange(callback) {
    this.peerConnection.onsignalingstatechange = callback;
  }

  _onIceCandidate(callback) {
    this.peerConnection.onicecandidate = callback;
  }

  _connected() {
    return this.iceConnected && this.connectionState;
  }
}

export function Initialize(userID) {
  class ZMeetManager {
    constructor() {
      this.userID = userID;
      this.peerConnection = null;
    }

    async connected() {
      return this.peerConnection._connected();
    }

    async listAllUsers() {
      return await this._listAllUsers();
    }

    async _listAllUsers() {
      const response = await fetch(`/api/v1/users`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch users. HTTP Status: ${response.status}`
        );
      }
      return await response.json();
    }

    async _fetchOffer() {
      const response = await fetch(`/api/v1/handshake/offer/${this.userID}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch offer. HTTP Status: ${response.status}`
        );
      }
      return await response.json();
    }

    async _sendAnswer(answer) {
      const response = await fetch(`/api/v1/handshake/answer/${this.userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answer),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send answer. HTTP Status: ${response.status}`
        );
      }
    }

    async start() {
      try {
        console.log("Starting ZMeet Manager...");

        this.peerConnection = new PeerConnection(userID);

        const offer = await this._fetchOffer();
        await this.peerConnection._setRemoteDescription(offer);

        const answer = await this.peerConnection._createAnswer();
        await this.peerConnection._setLocalDescription(answer);
        await this._sendAnswer(answer);
      } catch (error) {
        console.error("Error during ZMeet Manager start:", error);
      }
    }
  }

  // todo : Return an immutable instance of ZMeetManager
  return new ZMeetManager();
}
