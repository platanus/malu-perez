<template>
  <div class="flex justify-center w-full h-full pt-8">
    <div v-if="!!roomId">
      <hms-room
        :room-id="roomId"
        :room-color="roomColor"
        :room-name="roomName"
        :multiple="multipleRoom"
        :teacher-room-id="teacherRoomId"
      />
    </div>
    <div
      v-else
      class="flex flex-col justify-around px-10 text-xl font-bold text-center text-white bg-gray-800 rounded h-80"
    >
      <h2>Malú Pérez</h2>
      <p>Selecciona tu grupo</p>
      <button
        v-for="(room, roomKey) in rooms"
        :key="`room-${roomKey}`"
        type="button"
        class="text-white rounded-lg"
        :class="`bg-${room.color}-300`"
        @click="() => joinRoom(roomKey)"
      >
        {{ room.title }}
      </button>
    </div>
  </div>
</template>
<script>

import HmsRoom from './hms-room.vue';

export default {
  name: 'Hms',
  components: { HmsRoom },
  props: {},
  data() {
    return {
      userName: null,
      authToken: null,
      roomId: '',
      rooms: {
        a: { color: 'blue', title: 'Grupo Amigas A' },
        b: { color: 'pink', title: 'Grupo Amigas B' },
        ab: { color: 'yellow', title: 'Profesor' },
      },
      teacherRoomId: 'ab',
    };
  },
  methods: {
    joinRoom(roomId) {
      this.roomId = roomId;
    },
  },
  computed: {
    roomColor() {
      if (this.roomId) return this.rooms[this.roomId].color;

      return null;
    },

    roomName() {
      if (this.roomId) return this.rooms[this.roomId].title;

      return null;
    },
    multipleRoom() {
      const single = 1;
      if (this.roomId) return (this.roomId.length > single);

      return false;
    },
  },
};
</script>
