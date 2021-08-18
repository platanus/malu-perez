<template>
  <div>
    <div
      id="videoContainer"
      class="grid grid-cols-3"
    >
      DAILY CO
      <daily-co-tile
        :v-if="tiles.length > 0"
        v-for="participant in tiles"
        :key="participant.id"
        :user-id="participant.id"
        :video-track-state="participant.videoTrackState"
        :audio-track-state="participant.audioTrackState"
        :is-local-person="participant.id === 'local'"
      />
    </div>
  </div>
</template>
<script>
import DailyIframe from '@daily-co/daily-js';
import DailyCoTile from './daily-co-tile.vue';

const INITCALLSTATE = {
  callItems: {
    local: {
      videoTrackState: null,
      audioTrackState: null,
    },
  },
  clickAllowTimeoutFired: false,
  camOrMicError: null,
  fatalError: null,
};

export default {
  name: 'DailyCo',
  components: { DailyCoTile },
  props: {},
  data() {
    return {
      callObject: null,
      meetingEvents: ['joined-meeting', 'left-meeting', 'error'],
      participantsEvents: ['participant-joined', 'participant-updated', 'participant-left'],
      participants: {},
      participantsArray: [],
      callItems: {},
      largeTiles: [],
      smallTiles: [],
      tiles: [],
      callState: INITCALLSTATE,
    };
  },
  // eslint-disable-next-line max-statements
  async created() {
    this.callObject = DailyIframe.createCallObject();
    this.participants = await this.callObject.join({ url: 'https://maluperez.daily.co/yEZHPz2Nkncd1Q644cLQ' });
    this.participantsArray = [...this.participantsArray, this.participants.local];
    this.handleNewParticipantsState();
    // console.log(`state of intial video track: ${this.participants.local.tracks.video.state}`);
    // debugger;
    // const divVideoContainer = document.getElementById('videoContainer');
    // divVideoContainer.innerHTML = '';
    // const video = this.h('video', {
    //   class: 'bg-gray-700 h-64 w-96 rounded',
    //   autoPlay: true,
    // });
    // const audio = this.h('audio', {
    //   class: 'bg-gray-700 h-64 w-96 rounded',
    //   autoPlay: true,
    // });
    // video.srcObject = new MediaStream([this.participants.local.tracks.video.persistentTrack]);
    // audio.srcObject = new MediaStream([this.participants.local.tracks.audio.persistentTrack]);
    // divVideoContainer.append(video);
    // divVideoContainer.append(audio);
  },
  computed: {
    // meetingState() {
    //   return Boolean(this.callObject) ? this.callObject.meetingState() : null;
    // },
    // videoTrack() {
    //   if (Object.keys(this.participants).length === 0) {
    //     return '';
    //   }

    //   return this.participants.local ? this.participants.local.videoTrack : '';
    // },
  },
  watch: {
    callObject(newCallObject, oldCallObject) {
      if (oldCallObject) {
        this.meetingEvents.forEach((event) => {
          oldCallObject.off(event, this.handleNewMeetingState);
        });
        this.participantsEvents.forEach((event) => {
          oldCallObject.off(event, this.handleNewParticipantsState);
        });
      }
      this.meetingEvents.forEach((event) => {
        newCallObject.on(event, this.handleNewMeetingState);
      });
      this.participantsEvents.forEach((event) => {
        newCallObject.on(event, this.handleNewParticipantsState);
      });
    },
    callState() {
      this.tiles = this.getTiles();
    },
  },
  methods: {
    handleNewMeetingState(event) {
      if (event) {
        console.log(`handleNewMeetingState(${event})`);
        console.log(event);
      }
    },
    handleNewParticipantsState(event) {
      // debugger;
      if (event) {
        console.log(`handleNewParticipantState(${event})`);
        console.log(event);
        this.participants = this.callObject.participants;
        this.participantsArray = [...this.participantsArray, event.participant];
      }
      // debugger;
      // if (event.action === 'participant-updated' && event.participant.tracks.video.state === 'playable') {
      //   this.addParticipant(event.participant);
      // }
      const callItems = this.getCallItems(this.callObject.participants());
      this.callState = { ...this.callState, callItems };
      // debugger;
    },
    getCallItems(participants) {
      const callItems = { ...INITCALLSTATE.callItems }; // Ensure we *always* have a local participant
      for (const [id, participant] of Object.entries(participants)) {
        callItems[id] = {
          videoTrackState: participant.tracks.video,
          audioTrackState: participant.tracks.audio,
        };
        // if (shouldIncludeScreenCallItem(participant)) {
          //   callItems[id + '-screen'] = {
            //     videoTrackState: participant.tracks.screenVideo,
        //     audioTrackState: participant.tracks.screenAudio,
        //   };
      }

      return callItems;
    },
    getTiles() {
      console.log(`this is CALLSTATE: ${this.callState}`);
      if (!this.callState) return [];

      const tiles = [];
      // debugger;
      Object.entries(this.callState.callItems).forEach(([id, callItem]) => {
        const tile = {
          id,
          videoTrackState: callItem.videoTrackState,
          audioTrackState: callItem.audioTrackState,
        };
        tiles.push(tile);
      });
      // debugger;

      return tiles;
    },
    addTile(participant) {
      const divVideoContainer = document.getElementById('videoContainer');
      divVideoContainer.append(DailyCoTile.new);
    },
    addParticipant(participant) {
      const divVideoContainer = document.getElementById('videoContainer');
      // divVideoContainer.innerHTML = '';
      // debugger;

      const video = this.h('video', {
        class: 'bg-gray-700 h-64 w-96 rounded',
        autoPlay: true,
      });
      const audio = this.h('audio', {
        class: 'bg-gray-700 h-64 w-96 rounded',
        autoPlay: true,
      });
      video.srcObject = new MediaStream([participant.tracks.video.persistentTrack]);
      audio.srcObject = new MediaStream([participant.tracks.audio.persistentTrack]);
      const div = this.h('div', {
        class: 'border rounded-md',
        id: participant.session_id,
      }, video, audio);
      divVideoContainer.append(div);
      // divVideoContainer.append(audio);
    },
    shouldIncludeScreenCallItem(participant) {
      const trackStatesForInclusion = ['loading', 'playable', 'interrupted'];

      return (
        trackStatesForInclusion.includes(participant.tracks.screenVideo.state) ||
        trackStatesForInclusion.includes(participant.tracks.screenAudio.state)
      );
    },
    updateCallItems() {
      for (const [id, participant] of Object.entries(this.callObject.participants())) {
        this.callItems[id] = {
          videoTrackState: participant.tracks.video,
          audioTrackState: participant.tracks.audio,
        };
        if (this.shouldIncludeScreenCallItem(participant)) {
          this.callItems[`${id}-screen`] = {
            videoTrackState: participant.tracks.screenVideo,
            audioTrackState: participant.tracks.screenAudio,
          };
        }
      }
    },
    isScreenShare(id) {
      return id.endsWith('-screen');
    },
    isLocal(id) {
      return id === 'local';
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
  },
};
</script>
