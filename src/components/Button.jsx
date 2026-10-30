import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'ghost' | 'dark'
  withArrow = true,
  className = '',
  onClick,
  ...props
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const arrowChar = isRtl ? '↖' : '↗';

  const baseStyles =
    'inline-flex items-center justify-center font-heading font-semibold text-[15px] sm:text-[16px] px-6 sm:px-8 h-[52px] rounded-full transition-all duration-200 select-none group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1E4DD8] focus-visible:ring-offset-2';

  let variantStyles = '';

  if (variant === 'primary') {
    variantStyles =
      'bg-[#FF7A3D] text-[#1B1F2A] hover:bg-[#E2591B] hover:-translate-y-0.5 active:translate-y-0 shadow-none';
  } else if (variant === 'ghost') {
    variantStyles =
      'bg-transparent border-2 border-[#1B1F2A] text-[#1B1F2A] hover:bg-[#1B1F2A]/5 hover:-translate-y-0.5 active:translate-y-0';
  } else if (variant === 'dark') {
    variantStyles =
      'bg-[#1B1F2A] text-[#FFF7EE] hover:bg-[#282D3C] hover:-translate-y-0.5 active:translate-y-0';
  }

  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <span
          className={`inline-block text-[18px] leading-none transition-transform duration-200 ${
            isRtl
              ? 'mr-2 group-hover:-translate-x-1 group-hover:-translate-y-1'
              : 'ml-2 group-hover:translate-x-1 group-hover:-translate-y-1'
          }`}
          aria-hidden="true"
        >
          {arrowChar}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variantStyles} ${className}`} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variantStyles} ${className}`} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} onClick={onClick} {...props}>
      {content}
    </button>
  );
};
