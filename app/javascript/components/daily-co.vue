<template>
  <div>
    DAILY CO
    <video
      class="border border-rounded"
      auto-play
      muted
      plays-inline
      ref="myVideo"
    />
    <!-- <daily-co-tile
      v-for="(id, callItem) in tiles"
      :key="`tile-${id}`"
      :video-track-state="callItem.videoTrackState"
      :audio-track-state="callItem.audioTrackState"
      :is-local-person="isLocal(id)"
    /> -->
  </div>
</template>
<script>
import DailyIframe from '@daily-co/daily-js';
import DailyCoTile from './daily-co-tile.vue';

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
      callItems: {},
      largeTiles: [],
      smallTiles: [],
      tiles: [],
    };
  },
  async mounted() {
    this.callObject = DailyIframe.createCallObject();
    this.participants = await this.callObject.join({ url: 'https://maluperez.daily.co/7cwQGQUZsyfF6VVThs2C' });
    this.$refs.myVideo.srcObject = this.participants.local ? new MediaStream([this.participants.local.videoTrack]) : ''
    const callItems = {};
    for (const [id, participant] of Object.entries(this.callObject.participants())) {
      console.log('HER CALLITEMS INSIDE FOR');
      console.log(this.callItems);
      callItems[id] = {
        videoTrackState: participant.tracks.video,
        audioTrackState: participant.tracks.audio,
      };
      if (this.shouldIncludeScreenCallItem(participant)) {
        callItems[`${id}-screen`] = {
          videoTrackState: participant.tracks.screenVideo,
          audioTrackState: participant.tracks.screenAudio,
        };
      }
    }
    this.callItems = callItems;
  },
  computed: {
    meetingState() {
      return Boolean(this.callObject) ? this.callObject.meetingState() : null;
    },
    videoTrack() {
      if (Object.keys(this.participants).length === 0) {
        return '';
      } else {
        return this.participants.local ? new this.participants.local.videoTrack : '';
      }
    }
    // containsScreenShare() {
    //   return Object.keys(this.callItems).some((id) => this.isScreenShare(id));
    // },
    // callItemsEntries() {
    //   return Object.entries(this.callItems);
    // },
  },
  watch: {
    videoTrack() {
      if (this.$refs.myVideo) {
        // debugger;
        this.$refs.myVideo.srcObject = this.participants.local ? new MediaStream([this.videoTrack]) : ''
      }
    },
  },
//   watch: {
//     callObject(newCallObject) {
//       this.meetingEvents.forEach((event) => {
//         newCallObject.on(event, this.handleNewMeetingState);
//       });
//       this.participantsEvents.forEach((event) => {
//         newCallObject.on(event, this.handleNewParticipantsState);
//       });
//     },
//   },
  methods: {
    // handleNewMeetingState(event) {
    //   console.log(`handleNewMeetingState(${event})`);
    //   console.log(event);
    // },
    // async handleNewParticipantsState(event) {
    //   console.log(`handleNewParticipantState(${event})`);
    //   console.log(event);
    //   await this.updateCallItems();
    //   this.tiles = Object.entries(this.callItems);
    // },
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
  },
};
</script>
