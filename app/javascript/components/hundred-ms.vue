<template>
  <div class="flex justify-center w-full pt-8 bg-gray-900 h-96 items center">
    <div
      v-if="joined"
      class="flex flex-col justify-around w-full px-20 text-white bg-gray-800 rounded h-80"
    >
      <div class="flex items-end">
        <button
          id="leave-btn"
          type="button"
          class="px-10 text-white bg-red-500 rounded"
          @click="leaveRoom"
        >
          Leave Room
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2 ">
        <div
          v-for="peer in peers"
          :key="`peer-${peer.id}`"
          class="bg-gray-900 rounded "
        >
          {{ peer.name }} {{ peer.videoTrack }}
          <div
            :id="peer.id"
            class="border border-rounded"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col justify-around px-10 text-xl font-bold text-center text-white bg-gray-800 rounded h-80"
    >
      <h2>Malu Perez</h2>
      <div
        v-if="error"
        class="p-2 text-red-500 bg-red-300 rounded"
      >
        An error ocurred while joining the room
      </div>
      <div>
        <input
          id="username"
          type="text"
          class="w-full text-gray-800"
          v-model="userName"
          placeholder="Your username"
        >
      </div>
      <div>
        <input
          id="token"
          type="text"
          class="w-full text-gray-800"
          v-model="authToken"
          placeholder="Auth token"
        >
      </div>
      <button
        id="join-btn"
        type="button"
        class="text-white bg-blue-500 rounded"
        @click="joinRoom"
      >
        Join Room
      </button>
    </div>
  </div>
</template>
<script>

import { HMSReactiveStore, selectPeers } from '@100mslive/hms-video-store';

const hms = new HMSReactiveStore();
const hmsStore = hms.getStore();
const hmsActions = hms.getHMSActions();

export default {
  name: 'HundredMs',
  components: {},
  props: {},
  data() {
    return {
      userName: null,
      authToken: null,
      joined: false,
      error: null,
      peers: () => [],
      peersRendered: false,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    joinRoom() {
      try {
        hmsActions.join({
          userName: this.userName,
          authToken: this.authToken });
        this.joined = true;
        hmsStore.subscribe(this.updatePeers, selectPeers);
        this.peers = hmsStore.getState(selectPeers);
      } catch (error) {
        this.error = true;
      }
    },
    leaveRoom() {
      try {
        hmsActions.leave();
        this.joined = false;
      } catch (error) {
        this.error = true;
      }
    },
    h(tag, attrs = {}, ...children) {
      const newElement = document.createElement(tag);
      Object.keys(attrs).forEach((key) => {
        newElement.setAttribute(key, attrs[key]);
      });
      children.forEach((child) => {
        newElement.append(child);
      });

      return newElement;
    },

    renderPeer(peer) {
      const peerContainer = document.getElementById(peer.id);
      peerContainer.innerHTML = '';
      const video = this.h('video', {
        class: 'bg-gray-700 h-64 w-96 rounded',
        autoPlay: true,
      });
      hmsActions.attachVideo(peer.videoTrack, video);
      const videoPeerContainer = this.h(
        'div', { class: 'bg-gray-700 h-64 w-96 rounded' },
        video,
        this.h('div', { class: 'uppercase text-white' }, peer.name),
      );
      peerContainer.append(videoPeerContainer);
    },

    updatePeers(peers) {
      this.peers = peers;
      peers.forEach((peer) => {
        if (!!peer.videoTrack) this.renderPeer(peer);
      });
    },
  },
  watch: {
    peers(newPeers) {
      if (newPeers.length > 0) this.peersRendered = true;
    },
    joined(newJoined) {
      if (!newJoined) this.peers = [];
    },
  },
};
</script>
