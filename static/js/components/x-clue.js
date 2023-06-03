
export default {
  template: `
      <li class="clue" :class="clueClasses" @click="clicked">
        <slot></slot>
      </li>`,
  props: ['direction', 'gridnums', 'highlighted', 'clueType', 'number', 'crossNumbers'],
  data: function () {
    return {
      test: 1
    };
  },
  computed: {
    isHighlighted() {
      return this.direction === this.clueType && this.gridnums[this.highlighted[0]] == this.number
    },
    isSecondary() {
      return this.direction !== this.clueType && this.crossNumbers[0] == this.number
    },
    clueClasses() {
      return {highlighted: this.isHighlighted, secondary: this.isSecondary}
    }
  },
  watch: {
    isHighlighted: function () {
      this.$nextTick(function () {
        this.scrollClues()
      })
    },
  },
  methods: {
    clicked() {
      this.$emit("clue-clicked", this.number, this.clueType);
    },
    scrollClues() {
      let highlightedClue = document.querySelector('.clue.highlighted')
      let secondaryHlClue = document.querySelector('.clue.secondary')
      if (highlightedClue) {
        highlightedClue.scrollIntoView({behavior: "smooth", block: "center"})
        secondaryHlClue.scrollIntoView({behavior: "smooth", block: "center"})
      }
    }
  }
};
