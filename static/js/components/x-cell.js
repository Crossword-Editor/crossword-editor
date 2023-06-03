const BLACK = '.'

export default {
  template: `
      <div class="cell" :class="cellClasses" :style="cellStyle" @click="clicked">
        <slot name="number"></slot>
        <slot name="entry"></slot>
      </div>`,
  props: ['idx', 'activeCell', 'inputArea', 'grid', 'highlighted', 'colN', 'rowN', 'circles'],
  data: function () {
    return {
      test: 1
    };
  },
  computed: {
    isActive() {
      return this.idx === this.activeCell;
    },
    currentInput() {
      return this.idx === this.inputArea;
    },
    isBlack() {
      return this.grid[this.idx] === BLACK
    },
    isHighlighted() {
      return this.highlighted.includes(this.idx)
    },
    cellClasses() {
      return {
        active: this.isActive,
        black: this.isBlack,
        highlighted: this.isHighlighted,
        rebus: this.grid[this.idx].length > 1,
        circle: this.circles[this.idx] === 1
      }
    },
    cellStyle() {
      let max = Math.max(this.rowN, this.colN)
      return {'width': `${525 / max}px`, 'height': `${525 / max}px`}
    }
  },
  methods: {
    clicked() {
      this.$emit("cell-clicked", this.idx)
    }
  }
};

