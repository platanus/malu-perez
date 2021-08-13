<template>
  <div class="flex justify-center w-full pt-8 bg-gray-900 h-96 items center">
    <div
      v-if="joined"
      class="flex flex-col justify-around px-10 text-white bg-gray-800 rounded h-80"
    >
      <div>
        <button
          id="leave-btn"
          type="button"
          class="w-full text-white bg-red-500 rounded"
          @click="leaveRoom"
        >
          Leave Room
        </button>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col justify-around px-10 text-white bg-gray-800 rounded h-80"
    >
      <h2>Join Room</h2>
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
        Join
      </button>
    </div>
  </div>
</template>
<script>

import { HMSReactiveStore } from '@100mslive/hms-video-store';

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
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    joinRoom() {
      try {
        hmsActions.join({
          userName: this.userName,
          authToken: this.authToken });
        this.joined = true;
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
  },
};
</script>
