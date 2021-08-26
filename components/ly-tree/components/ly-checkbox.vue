<template>
	<text :class="classObj.wrapper" @click.stop="handleClick">
		<text :class="[classObj.input, {'is-indeterminate': indeterminate, 'is-checked': checked, 'is-disabled': disabled}]">
			<text :class="classObj.inner"></text>
		</text>
	</text>
</template>

<script>
	export default {
		data() {
			return {
				classObj: {}
			}
		},
		
		props: {
			type: {
				type: String,
				validator(t) {
					return t === 'radio' || t === 'checkbox'
				}
			},
			checked: Boolean,
			disabled: Boolean,
			indeterminate: Boolean
		},
		
		created() {
			this.classObj = {
				wrapper: `ly-${this.type}`,
				input: `ly-${this.type}__input`,
				inner: `ly-${this.type}__inner`
			}
		},
		
		methods: {
			handleClick() {
				this.$emit('check', this.checked);
			}
		}
	}
</script>

<style>
	/* lyRadio/lyCheckbox-start */
	.ly-checkbox,
	.ly-radio {
		color: #606266;
		font-weight: 500;
		font-size: 28rpx;
		cursor: pointer;
		user-select: none;
		padding-right: 16rpx
	}
	
	.ly-checkbox__input,
	.ly-radio__input {
		cursor: pointer;
		outline: 0;
		line-height: 1;
		vertical-align: middle
	}
	
	.ly-checkbox__input.is-disabled .ly-checkbox__inner,
	.ly-radio__input.is-disabled .ly-radio__inner {
		background-color: #edf2fc;
		border-color: #DCDFE6;
		cursor: not-allowed
	}
	
	.ly-checkbox__input.is-disabled .ly-checkbox__inner::after,
	.ly-radio__input.is-disabled .ly-radio__inner::after {
		cursor: not-allowed;
		border-color: #C0C4CC
	}
	
	.ly-checkbox__input.is-disabled .ly-checkbox__inner+.ly-checkbox__label,
	.ly-radio__input.is-disabled .ly-radio__inner+.ly-radio__label {
		cursor: not-allowed
	}
	
	.ly-checkbox__input.is-disabled.is-checked .ly-checkbox__inner,
	.ly-radio__input.is-disabled.is-checked .ly-radio__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6
	}
	
	.ly-checkbox__input.is-disabled.is-checked .ly-checkbox__inner::after,
	.ly-radio__input.is-disabled.is-checked .ly-radio__inner::after {
		border-color: #C0C4CC
	}
	
	.ly-checkbox__input.is-disabled.is-indeterminate .ly-checkbox__inner {
		background-color: #F2F6FC;
		border-color: #DCDFE6
	}
	
	.ly-checkbox__input.is-disabled.is-indeterminate .ly-checkbox__inner::before {
		background-color: #C0C4CC;
		border-color: #C0C4CC
	}
	
	.ly-checkbox__input.is-checked .ly-checkbox__inner,
	.ly-radio__input.is-checked .ly-radio__inner,
	.ly-checkbox__input.is-indeterminate .ly-checkbox__inner {
		background-color: #409EFF;
		border-color: #409EFF
	}
	
	.ly-checkbox__input.is-disabled+text.ly-checkbox__label,
	.ly-radio__input.is-disabled+text.ly-radio__label {
		color: #C0C4CC;
		cursor: not-allowed
	}
	
	.ly-checkbox__input.is-checked .ly-checkbox__inner::after,
	.ly-radio__input.is-checked .ly-radio__inner::after {
		-webkit-transform: rotate(45deg) scaleY(1);
		transform: rotate(45deg) scaleY(1)
	}
	
	.ly-checkbox__input.is-checked+.ly-checkbox__label,
	.ly-radio__input.is-checked+.ly-radio__label {
		color: #409EFF
	}
	
	.ly-checkbox__input.is-focus .ly-checkbox__inner,
	.ly-radio__input.is-focus .ly-radio__inner {
		border-color: #409EFF
	}
	
	.ly-checkbox__input.is-indeterminate .ly-checkbox__inner::before {
		content: '';
		position: absolute;
		display: block;
		background-color: #FFF;
		height: 6rpx;
		-webkit-transform: scale(.5);
		transform: scale(.5);
		left: 0;
		right: 0;
		top: 10rpx
	}
	
	.ly-checkbox__input.is-indeterminate .ly-checkbox__inner::after {
		display: none
	}
	
	.ly-checkbox__inner,
	.ly-radio__inner {
		display: inline-block;
		position: relative;
		border: 2rpx solid #DCDFE6;
		border-radius: 4rpx;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 28rpx;
		height: 28rpx;
		background-color: #FFF;
		z-index: 1;
		-webkit-transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
		transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46)
	}
	
	.ly-radio__inner {
		border-radius: 50%;
		width: 34rpx !important;
		height: 34rpx !important;
	}
	
	.ly-checkbox__inner::after,
	.ly-radio__inner::after {
		-webkit-box-sizing: content-box;
		box-sizing: content-box;
		content: "";
		border: 2rpx solid #FFF;
		border-left: 0;
		border-top: 0;
		height: 14rpx;
		left: 10rpx;
		position: absolute;
		top: 2rpx;
		-webkit-transform: rotate(45deg) scaleY(0);
		transform: rotate(45deg) scaleY(0);
		width: 6rpx;
		-webkit-transition: -webkit-transform .15s ease-in .05s;
		transition: -webkit-transform .15s ease-in .05s;
		transition: transform .15s ease-in .05s;
		transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
		-webkit-transform-origin: center;
		transform-origin: center
	}
	
	.ly-radio__inner::after {
		left: 12rpx !important;
		top: 6rpx !important;
	}
	/* lyRadio/lyCheckbox-end */
</style>