import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      {/* ── Image Placeholder ── */}
      <div className="skeleton-image shimmer"></div>

      {/* ── Info Placeholder ── */}
      <div className="skeleton-info">
        {/* Title lines */}
        <div className="skeleton-line skeleton-title shimmer"></div>
        <div className="skeleton-line skeleton-title-short shimmer"></div>

        {/* Rating */}
        <div className="skeleton-line skeleton-rating shimmer"></div>

        {/* Price */}
        <div className="skeleton-price-row">
          <div className="skeleton-line skeleton-price shimmer"></div>
          <div className="skeleton-line skeleton-price-old shimmer"></div>
          <div className="skeleton-line skeleton-discount shimmer"></div>
        </div>

        {/* Category */}
        <div className="skeleton-line skeleton-category shimmer"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
