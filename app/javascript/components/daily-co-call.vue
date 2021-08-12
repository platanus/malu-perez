<template>
  <div>
    DAILY CO CALL
    <div>
      <div className="small-tiles">
        {smallTiles}
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'DailyCoCall',
  components: {},
  props: {
    callObject: { type: Object, default: null },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
