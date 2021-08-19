<template>
  <div class="flex justify-center w-full h-full pt-8 bg-gray-900 items center">
    <div
      v-if="joined"
      class="flex flex-col w-full h-full px-20 py-20 text-white rounded"
    >
      <div class="flex flex-row py-10">
        <button
          type="button"
          class="px-10 text-white rounded-lg"
          :class="`bg-${roomColor}-300`"
          disabled
        >
          {{ roomName }}
        </button>
        <button
          id="leave-btn"
          type="button"
          class="px-10 mx-10 text-white bg-red-500 rounded"
          @click="leaveRoom"
        >
          Salir de la clase
        </button>
      </div>
      <div v-if="multiple">
        <div class="grid grid-cols-3 gap-2 ">
          <div
            v-for="peer in peers"
            :key="`peer-${peer.id}`"
            class="bg-gray-900 rounded "
          >
            <div
              v-if="isInTeacherRoom(peer)"
              :id="peer.id"
              class="self-center px-2 pt-2 bg-gray-800 border border-gray-700 rounded-xl"
            />
          </div>
        </div>
        <div
          v-for="singleRoomId in roomId"
          :key="`room-${singleRoomId}`"
        >
          <button
            type="button"
            class="px-10 my-4 text-white rounded-lg"
            :class="`bg-${rooms[singleRoomId].color}-300`"
            disabled
          >
            {{ rooms[singleRoomId].title }}
          </button>
          <div class="grid grid-cols-3 gap-2 ">
            <div
              v-for="peer in peers"
              :key="`peer-${peer.id}`"
              class="bg-gray-900 rounded "
            >
              <div
                v-if="isInSingleRoom(peer, singleRoomId)"
                :id="peer.id"
                class="self-center px-2 pt-2 bg-gray-800 border border-gray-700 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="grid grid-cols-3 gap-2 "
      >
        <div
          v-for="peer in peers"
          :key="`peer-${peer.id}`"
          class="bg-gray-900 rounded "
        >
          <div
            v-if="isInSingleRoom(peer, roomId) || isInTeacherRoom(peer)"
            :id="peer.id"
            class="px-2 bg-gray-800 border border-gray-700 rounded-xl"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col justify-around px-10 text-xl font-bold text-center text-white bg-gray-800 rounded h-80"
    >
      <h2> {{ roomName }}</h2>
      <div
        v-if="error"
        class="p-2 text-red-500 bg-red-300 rounded"
      >
        Ocurrió un error al unirse a la clase
      </div>
      <div>
        <input
          id="username"
          type="text"
          class="w-full text-gray-800"
          v-model="userName"
          placeholder="Nombre"
        >
      </div>
      <div>
        <input
          id="token"
          type="text"
          class="w-full text-gray-800"
          v-model="authToken"
          placeholder="Código Clase"
        >
      </div>
      <button
        id="join-btn"
        type="button"
        class="text-white rounded-lg"
        :class="`bg-${roomColor}-300`"
        @click="joinRoom"
      >
        Entrar a la clase
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
  name: 'HmsSingleRoom',
  components: {},
  props: {
    roomId: { type: String, required: true },
    roomColor: { type: String, required: true },
    roomName: { type: String, required: true },
    multiple: { type: Boolean, default: false },
    teacherRoomId: { type: String, required: true },
  },
  data() {
    return {
      userName: null,
      authToken: null,
      joined: false,
      error: null,
      peers: () => [],
      peersRendered: false,
      rooms: {
        a: { color: 'blue', title: 'Grupo Amigas A' },
        b: { color: 'pink', title: 'Grupo Amigas B' },
        ab: { color: 'yellow', title: 'Profesor' },
      },
    };
  },
  computed: {
    userNameWithRoom() {
      return `${this.userName}-room-${this.roomId}`;
    },
  },
  created() {},
  mounted() {},
  methods: {
    joinRoom() {
      try {
        hmsActions.join({
          userName: this.userNameWithRoom,
          authToken: this.authToken });
        this.joined = true;
        this.$emit('joined');
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
        this.$emit('left');
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
        class: 'w-full h-full rounded-xl',
        autoPlay: true,
      });
      hmsActions.attachVideo(peer.videoTrack, video);
      const videoPeerContainer = this.h(
        'div', { class: 'rounded w-full h-full' },
        video,
        this.h('div', { class: 'uppercase text-white' }, peer.name),
      );
      peerContainer.append(videoPeerContainer);
    },

    isInRoom(peer, roomId) {
      return peer.name.includes(`room-${roomId}`);
    },

    isInTeacherRoom(peer) {
      return this.isInRoom(peer, this.teacherRoomId);
    },

    isInSingleRoom(peer, roomId) {
      return !this.isInTeacherRoom(peer) && this.isInRoom(peer, roomId);
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
