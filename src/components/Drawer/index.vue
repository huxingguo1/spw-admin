<template>
  <transition
    name="el-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      role="presentation"
    >
      <div
        class="el-drawer__container"
        :class="visible && 'el-drawer__open'"
        role="document"
        tabindex="-1"
        @click.self="handleWrapperClick"
      >
        <div
          ref="drawer"
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          class="el-drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${size}` : `height: ${size}`"
          role="presentation"
        >
          <header id="el-drawer__title" class="el-drawer__header">
            <slot name="title">
              <span role="heading">{{ title }}</span>
            </slot>
            <button
              v-if="showClose"
              :aria-label="`close ${title || 'drawer'}`"
              class="el-drawer__close-btn"
              type="button"
              @click="closeDrawer"
            >
              <i class="el-dialog__close el-icon el-icon-close" />
            </button>
          </header>
          <section v-if="rendered" class="el-drawer__body">
            <slot />
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/src/utils/popup'
import Migrating from 'element-ui/src/mixins/migrating'
import emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'ElDrawer',
  mixins: [Popup, emitter, Migrating],
  props: {
    appendToBody: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: undefined
    },
    customClass: {
      type: String,
      default: ''
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'rtl',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      }
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '30%'
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean
    },
    wrapperClosable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      closed: false
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        if (!this.closed) this.$emit('close')
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        if (this.destroyOnClose === true) {
          this.rendered = false
        }
        this.closed = true
      }
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @keyframes el-drawer-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @mixin b($block) {
    $B: 'el-'+$block !global;

    .#{$B} {
      @content;
    }
  }
  @mixin drawer-animation($direction) {

    @keyframes #{$direction}-drawer-in {
      0% {

        @if $direction == ltr {
          transform: translate(-100%, 0px);
        }

        @if $direction == rtl {
          transform: translate(100%, 0px);
        }

        @if $direction == ttb {
          transform: translate(0px, -100%);
        }

        @if $direction == btt {
          transform: translate(0px, 100%);
        }
      }

      100% {
        @if $direction == ltr {
          transform: translate(0px, 0px);
        }

        @if $direction == rtl {
          transform: translate(0px, 0px);
        }

        @if $direction == ttb {
          transform: translate(0px, 0px);
        }

        @if $direction == btt {
          transform: translate(0px, 0px);
        }
      }
    }

    @keyframes #{$direction}-drawer-out {
      0% {
        @if $direction == ltr {
          transform: translate(0px, 0px);
        }

        @if $direction == rtl {
          transform: translate(0px, 0px);;
        }

        @if $direction == ttb {
          transform: translate(0px, 0px);
        }

        @if $direction == btt {
          transform: translate(0px, 0);
        }
      }

      100% {
        @if $direction == ltr {
          transform: translate(-100%, 0px);
        }

        @if $direction == rtl {
          transform: translate(100%, 0px);
        }

        @if $direction == ttb {
          transform: translate(0px, -100%);
        }

        @if $direction == btt {
          transform: translate(0px, 100%);
        }
      }
    }
  }

  @mixin animation-in($direction) {
    .el-drawer__open &.#{$direction} {
      animation: #{$direction}-drawer-in 225ms cubic-bezier(0, 0, .2, 1) 0ms;
    }
  }

  @mixin animation-out($direction) {
    &.#{$direction} {
      animation: #{$direction}-drawer-out 225ms cubic-bezier(0, 0, .2, 1) 0ms;
    }
  }

  @include drawer-animation(rtl);
  @include drawer-animation(ltr);
  @include drawer-animation(ttb);
  @include drawer-animation(btt);

  $directions: rtl, ltr, ttb, btt;

  $--dialog-background-color: #FFFFFF !default;
  $--dialog-padding-primary: 20px !default;
  $--font-size-extra-large: 20px !default;
  @include b(drawer) {
    position: absolute;
    box-sizing: border-box;
    background-color: $--dialog-background-color;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);
    overflow: hidden;

    @each $direction in $directions {
      @include animation-out($direction);
      @include animation-in($direction);
    }

    &__header {
      align-items: center;
      color: rgb(114, 118, 123);
      display: flex;
      margin-bottom: 12px;
      padding: $--dialog-padding-primary;
      padding-bottom: 0;
      & > :first-child {
        flex: 1;
      }
    }

    &__title {
      margin: 0;
      flex: 1;
      line-height: inherit;
      font-size: 1rem;
    }

    &__close-btn {
      border: none;
      cursor: pointer;
      font-size: $--font-size-extra-large;
      color: inherit;
      background-color: transparent;
    }

    &__body {
      flex: 1;
      & > * {
        box-sizing: border-box;
      }
    }

    &.ltr, &.rtl {
      height: 100%;
      top: 0;
      bottom: 0;
    }

    &.ttb, &.btt {
      width: 100%;
      left: 0;
      right: 0;
    }

    &.ltr {
      left: 0;
    }

    &.rtl {
      right: 0;
    }

    &.ttb {
      top: 0;
    }

    &.btt {
      bottom: 0;
    }
  }

  .el-drawer__container {
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
  .el-drawer__body {
    padding: 20px;
  }
  .el-drawer-fade-enter-active {
    animation: el-drawer-fade-in 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

  .el-drawer-fade-leave-active {
    animation: el-drawer-fade-in 225ms cubic-bezier(0, 0, 0.2, 1) 0ms reverse;
  }
</style>
