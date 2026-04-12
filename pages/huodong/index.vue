<template>
	<view class="page">
		<!-- 顶部轮播 -->
		<swiper v-if="banners.length" class="banner-swiper" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
			indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff">
			<swiper-item v-for="(item, index) in banners" :key="index">
				<image class="banner-img" mode="aspectFill" :src="item.pic" />
				<view class="banner-tag" v-if="item.tag">{{ item.tag }}</view>
			</swiper-item>
		</swiper>

		<!-- 活动标题区 -->
		<view class="activity-header" v-if="activityInfo.title">
			<view class="activity-title-box">
				<view class="title-deco"></view>
				<text class="activity-title">{{ activityInfo.title }}</text>
				<view class="title-deco"></view>
			</view>
			<text class="activity-subtitle" v-if="activityInfo.titleSub">{{ activityInfo.titleSub }}</text>
			<view class="activity-meta" v-if="activityInfo.dateStart || activityInfo.address">
				<view class="meta-item" v-if="activityInfo.dateStart">
					<text class="meta-label">活动时间</text>
					<text class="meta-value">{{ activityInfo.dateStart }}{{ activityInfo.dateDeadline ? ' - ' + activityInfo.dateDeadline : '' }}</text>
				</view>
				<view class="meta-divider" v-if="activityInfo.dateStart && activityInfo.address"></view>
				<view class="meta-item" v-if="activityInfo.address">
					<text class="meta-label">活动地点</text>
					<text class="meta-value">{{ activityInfo.address }}</text>
				</view>
			</view>
		</view>

		<!-- 优惠券区域 -->
		<view class="section-block" v-if="coupons.length">
			<view class="section-header">
				<view class="section-title-line"></view>
				<text class="section-title">专属优惠券</text>
				<text class="section-desc">限时领取，先到先得</text>
			</view>
			<scroll-view class="coupon-scroll" scroll-x="true">
				<view class="coupon-list">
					<view class="coupon-card" v-for="(item, idx) in coupons" :key="idx"
						:class="item.received ? 'coupon-received' : ''" @click="receiveCoupon(idx)">
						<view class="coupon-left">
							<!-- 固定金额 -->
							<view class="coupon-amount" v-if="item.moneyType === 0">
								<text class="coupon-symbol">¥</text>
								<text class="coupon-value">{{ item.moneyMin }}</text>
								<text class="coupon-superscript" v-if="item.isRange">起</text>
							</view>
							<!-- 百分比折扣 -->
							<view class="coupon-amount" v-else>
								<text class="coupon-value coupon-value--pct">{{ item.moneyMin }}</text>
								<text class="coupon-superscript" v-if="item.isRange">起</text>
								<text class="coupon-symbol coupon-symbol--pct">折</text>
							</view>
							<text class="coupon-condition" v-if="item.moneyHreshold">满{{ item.moneyHreshold }}元可用</text>
							<text class="coupon-condition" v-else>无门槛</text>
						</view>
						<view class="coupon-divider">
							<view class="coupon-circle top"></view>
							<view class="coupon-dashes"></view>
							<view class="coupon-circle bottom"></view>
						</view>
						<view class="coupon-right">
							<text class="coupon-name">{{ item.name }}</text>
							<text class="coupon-expire">{{ item.expire }}</text>
							<!-- 领取条件标签 -->
							<view class="coupon-tags" v-if="item.needAmount || item.needScore || item.needSignedContinuous || item.isPwd">
								<text class="coupon-tag" v-if="item.needAmount">付{{ item.needAmount }}元得</text>
								<text class="coupon-tag" v-if="item.needScore">{{ item.needScore }}积分兑</text>
								<text class="coupon-tag" v-if="item.needSignedContinuous">连签{{ item.needSignedContinuous }}天</text>
								<text class="coupon-tag coupon-tag--pwd" v-if="item.isPwd">口令券</text>
							</view>
							<view class="coupon-btn" :class="item.received ? 'btn-received' : ''">
								{{ item.received ? '已领取' : '立即领取' }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 商品列表 -->
		<view class="section-block" v-if="showGoods.length">
			<view class="section-header">
				<view class="section-title-line"></view>
				<text class="section-title">活动商品</text>
				<text class="section-desc">精选好物，限时特惠</text>
			</view>
			<view class="goods-grid">
				<view class="goods-card" v-for="(item, index) in showGoods" :key="item.id"
					@click="navigateTo('/pages/goods/detail?goodsId=' + item.id)">
					<view class="goods-img-wrap">
						<image class="goods-img" mode="aspectFill" :src="item.pic" />
						<view class="goods-badge" v-if="item.isMiaosha">秒杀</view>
					</view>
					<view class="goods-info">
						<text class="goods-name">{{ item.name }}</text>
						<view class="goods-price-row">
							<view class="goods-price">
								<text class="price-symbol">¥</text>
								<text class="price-value">{{ item.minPrice }}</text>
							</view>
							<text class="price-origin" v-if="item.originalPrice && item.originalPrice != item.minPrice">¥{{ item.originalPrice }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 查看更多 -->
			<view class="more-btn" v-if="hasMore" @click="expandGoods">
				<text class="more-text">查看更多商品</text>
				<text class="more-arrow">›</text>
			</view>
		</view>

		<!-- 免责声明 -->
		<view class="disclaimer-block" v-if="disclaimers.length">
			<view class="disclaimer-header">
				<text class="disclaimer-icon">📋</text>
				<text class="disclaimer-title">免责声明</text>
			</view>
			<view class="disclaimer-content">
				<text class="disclaimer-text" v-for="(item, index) in disclaimers" :key="index">{{ item }}</text>
			</view>
		</view>

		<view class="footer-space"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activityId: null,
				activityInfo: {},
				banners: [],
				coupons: [],
				allGoods: [],
				showGoods: [],
				goodsExpanded: false,
				disclaimers: [],
			}
		},
		computed: {
			hasMore() {
				return !this.goodsExpanded && this.allGoods.length > 6
			}
		},
		onLoad(e) {
			this.activityId = e.id
			this._loadActivity()
		},
		onShow() {},
		onShareAppMessage() {
			return {
				title: this.activityInfo.title,
				path: '/pages/huodong/index?id=' + this.activityId + "&?inviter_id=' + (this.uid || '')",
			}
		},
		onShareTimeline() {
			return {
				title: this.activityInfo.title,
				query: 'inviter_id=' + (this.uid || '') + '&id=' + this.activityId,
			}
		},
		methods: {
			async _loadActivity() {
				uni.showLoading({ title: '' })
				const res = await this.$wxapi.activityMallInfoInfo({ id: this.activityId })
				uni.hideLoading()
				if (res.code != 0) {
					uni.showToast({ title: res.msg || '加载失败', icon: 'none' })
					return
				}
				const info = res.data.info
				this.activityInfo = info
				uni.setNavigationBarTitle({ title: info.title || '活动商城' })
				await Promise.all([
					this._loadBanners(info.bannerType),
					info.couponRuleIds ? this._loadCoupons(info.couponRuleIds) : Promise.resolve(),
					info.goodsIds ? this._loadGoods(info.goodsIds) : Promise.resolve(),
					info.disclaimerPageKey ? this._loadDisclaimer(info.disclaimerPageKey) : Promise.resolve(),
				])
			},
			async _loadBanners(type) {
				const res = await this.$wxapi.banners({ type })
				if (res.code == 0 && res.data) {
					this.banners = res.data.map(item => ({
						pic: item.picUrl,
						tag: item.title || '',
					}))
				}
			},
			async _loadCoupons(ids) {
				const res = await this.$wxapi.coupons({ ids })
				if (res.code == 0 && res.data) {
					this.coupons = res.data.map(item => {
						// 计算展示值：相同为固定值，不同为范围
						const min = item.moneyMin
						const max = item.moneyMax
						return {
							id: item.id,
							moneyType: item.moneyType,
							moneyMin: min,
							isRange: min !== max,
							moneyHreshold: item.moneyHreshold || '',
							name: item.name || '',
							expire: item.endTime ? item.endTime.substring(5, 10).replace('-', '月') + '日到期' : '',
							needAmount: item.needAmount || 0,
							needScore: item.needScore || 0,
							needSignedContinuous: item.needSignedContinuous || 0,
							isPwd: item.pwd === 'Y',
							received: false,
						}
					})
				}
			},
			async _loadGoods(gids) {
				const res = await this.$wxapi.goodsv2({ gids, pageSize: 200 })
				if (res.code == 0 && res.data && res.data.result) {
					this.allGoods = res.data.result
					this.showGoods = this.allGoods.slice(0, 6)
				}
			},
			async _loadDisclaimer(key) {
				const res = await this.$wxapi.cmsPage(key)
				if (res.code == 0 && res.data && res.data.info) {
					const text = res.data.info.content || ''
					const stripped = text.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ')
					this.disclaimers = stripped.split('\n').map(s => s.trim()).filter(s => s.length > 0)
				}
			},
			async receiveCoupon(index) {
				const item = this.coupons[index]
				if (item.received) return
				const res = await this.$wxapi.fetchCoupons({ id: item.id, token: this.token })
				if (res.code == 0) {
					this.$set(this.coupons[index], 'received', true)
					uni.showToast({ title: '领取成功', icon: 'success' })
				} else {
					uni.showToast({ title: res.msg || '领取失败', icon: 'none' })
				}
			},
			expandGoods() {
				this.showGoods = this.allGoods
				this.goodsExpanded = true
			},
			navigateTo(url) {
				uni.navigateTo({ url })
			},
		}
	}
</script>

<style scoped lang="scss">
	.page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* ===== 轮播 ===== */
	.banner-swiper {
		width: 100%;
		height: 380rpx;
		position: relative;
	}

	.banner-img {
		width: 100%;
		height: 380rpx;
	}

	.banner-tag {
		position: absolute;
		top: 24rpx;
		left: 24rpx;
		background: linear-gradient(135deg, #ef4444, #dc2626);
		color: #fff;
		font-size: 22rpx;
		padding: 6rpx 18rpx;
		border-radius: 20rpx;
		font-weight: 600;
		letter-spacing: 2rpx;
	}

	/* ===== 活动标题 ===== */
	.activity-header {
		margin: 24rpx 24rpx 0;
		background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
		border-radius: 20rpx;
		padding: 40rpx 32rpx;
		box-shadow: 0 4rpx 24rpx rgba(239, 68, 68, 0.08);
		border: 1rpx solid rgba(239, 68, 68, 0.1);
	}

	.activity-title-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
	}

	.title-deco {
		width: 40rpx;
		height: 2rpx;
		background: linear-gradient(90deg, transparent, #ef4444);
		margin: 0 16rpx;
	}

	.title-deco:last-child {
		background: linear-gradient(90deg, #ef4444, transparent);
	}

	.activity-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #1a1a1a;
		letter-spacing: 4rpx;
	}

	.activity-subtitle {
		display: block;
		text-align: center;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 28rpx;
		line-height: 1.6;
	}

	.activity-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #fef2f2;
		border-radius: 12rpx;
		padding: 20rpx 24rpx;
	}

	.meta-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.meta-label {
		font-size: 22rpx;
		color: #999;
		margin-bottom: 6rpx;
	}

	.meta-value {
		font-size: 24rpx;
		color: #ef4444;
		font-weight: 600;
	}

	.meta-divider {
		width: 1rpx;
		height: 48rpx;
		background: rgba(239, 68, 68, 0.2);
		margin: 0 16rpx;
	}

	/* ===== 通用区块 ===== */
	.section-block {
		margin: 24rpx 24rpx 0;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 32rpx 0 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.section-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 32rpx 24rpx;
	}

	.section-title-line {
		width: 6rpx;
		height: 32rpx;
		background: linear-gradient(180deg, #ef4444, #dc2626);
		border-radius: 3rpx;
		margin-right: 14rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #1a1a1a;
		margin-right: 12rpx;
	}

	.section-desc {
		font-size: 22rpx;
		color: #999;
	}

	/* ===== 优惠券 ===== */
	.coupon-scroll {
		width: 100%;
	}

	.coupon-list {
		display: flex;
		flex-direction: row;
		padding: 0 24rpx 8rpx;
		white-space: nowrap;
	}

	.coupon-card {
		display: inline-flex;
		flex-direction: row;
		width: 460rpx;
		min-height: 160rpx;
		margin-right: 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.15);
		flex-shrink: 0;
	}

	.coupon-left {
		width: 150rpx;
		background: linear-gradient(135deg, #ef4444, #dc2626);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 16rpx 8rpx;
		flex-shrink: 0;
	}

	.coupon-amount {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		color: #fff;
	}

	.coupon-symbol {
		font-size: 24rpx;
		color: #fff;
		margin-bottom: 4rpx;
	}

	.coupon-value {
		font-size: 52rpx;
		font-weight: 700;
		color: #fff;
		line-height: 1;
	}

	.coupon-value--pct {
		font-size: 44rpx;
	}

	.coupon-symbol--pct {
		font-size: 24rpx;
		color: #fff;
		margin-bottom: 4rpx;
		margin-left: 2rpx;
	}

	.coupon-superscript {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.85);
		align-self: flex-start;
		margin-top: 6rpx;
		margin-left: 2rpx;
	}

	.coupon-condition {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-top: 6rpx;
	}

	.coupon-divider {
		width: 24rpx;
		background: #fef2f2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	.coupon-circle {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background: #f5f5f5;
		position: absolute;
	}

	.coupon-circle.top {
		top: -10rpx;
	}

	.coupon-circle.bottom {
		bottom: -10rpx;
	}

	.coupon-dashes {
		width: 1rpx;
		height: 100%;
		border-left: 2rpx dashed rgba(239, 68, 68, 0.3);
		margin: 0 auto;
	}

	.coupon-right {
		flex: 1;
		background: #fef2f2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 16rpx 20rpx;
		min-width: 0;
	}

	.coupon-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 6rpx;
		line-height: 1.4;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.coupon-expire {
		font-size: 20rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.coupon-tags {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 8rpx;
		margin-bottom: 10rpx;
	}

	.coupon-tag {
		font-size: 18rpx;
		color: #ef4444;
		background: rgba(239, 68, 68, 0.1);
		border: 1rpx solid rgba(239, 68, 68, 0.3);
		border-radius: 6rpx;
		padding: 2rpx 10rpx;
		line-height: 1.6;
	}

	.coupon-tag--pwd {
		color: #f97316;
		background: rgba(249, 115, 22, 0.1);
		border-color: rgba(249, 115, 22, 0.3);
	}

	.coupon-btn {
		display: inline-block;
		background: linear-gradient(135deg, #ef4444, #dc2626);
		color: #fff;
		font-size: 22rpx;
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		text-align: center;
		font-weight: 600;
		align-self: flex-start;
	}

	.coupon-received .coupon-left {
		background: linear-gradient(135deg, #d1d5db, #9ca3af);
	}

	.coupon-received .coupon-right {
		background: #f9fafb;
	}

	.btn-received {
		background: #d1d5db !important;
		color: #9ca3af !important;
	}

	/* ===== 商品列表 ===== */
	.goods-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		padding: 0 24rpx;
	}

	.goods-card {
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
		border: 1rpx solid #f0f0f0;
	}

	.goods-img-wrap {
		position: relative;
		width: 100%;
		height: 280rpx;
	}

	.goods-img {
		width: 100%;
		height: 280rpx;
	}

	.goods-badge {
		position: absolute;
		top: 12rpx;
		left: 12rpx;
		background: linear-gradient(135deg, #ef4444, #dc2626);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 14rpx;
		border-radius: 12rpx;
		font-weight: 600;
	}

	.goods-info {
		padding: 16rpx 16rpx 20rpx;
	}

	.goods-name {
		font-size: 26rpx;
		color: #1a1a1a;
		line-height: 1.5;
		height: calc(26rpx * 1.5 * 2);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		margin-bottom: 10rpx;
	}

	.goods-price-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-bottom: 10rpx;
	}

	.goods-price {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		color: #ef4444;
	}

	.price-symbol {
		font-size: 22rpx;
		font-weight: 600;
		color: #ef4444;
	}

	.price-value {
		font-size: 36rpx;
		font-weight: 700;
		color: #ef4444;
		line-height: 1;
	}

	.price-origin {
		font-size: 22rpx;
		color: #bbb;
		text-decoration: line-through;
		margin-left: 8rpx;
	}

	/* ===== 查看更多 ===== */
	.more-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 32rpx 24rpx 8rpx;
		padding: 24rpx;
		border: 1rpx solid rgba(239, 68, 68, 0.3);
		border-radius: 50rpx;
		background: linear-gradient(135deg, #fff5f5, #ffffff);
	}

	.more-text {
		font-size: 28rpx;
		color: #ef4444;
		font-weight: 600;
	}

	.more-arrow {
		font-size: 36rpx;
		color: #ef4444;
		margin-left: 8rpx;
		line-height: 1;
	}

	/* ===== 免责声明 ===== */
	.disclaimer-block {
		margin: 24rpx 24rpx 0;
		background: #fff;
		border-radius: 20rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.disclaimer-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.disclaimer-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
	}

	.disclaimer-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #666;
	}

	.disclaimer-content {
		display: flex;
		flex-direction: column;
	}

	.disclaimer-text {
		font-size: 22rpx;
		color: #999;
		line-height: 1.8;
		margin-bottom: 8rpx;
	}

	.footer-space {
		height: 60rpx;
	}
</style>
