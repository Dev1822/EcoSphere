import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScrollToTop } from '@/components/shared/scroll-to-top';

describe('ScrollToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
    window.scrollTo = jest.fn();
  });

  it('renders the scroll to top button with aria-label', () => {
    const { getByRole } = render(<ScrollToTop />);
    const button = getByRole('button', { name: /scroll to top/i });
    expect(button).toBeInTheDocument();
  });

  it('is hidden when scroll Y position is less than or equal to threshold', () => {
    const { getByRole } = render(<ScrollToTop threshold={300} />);
    const button = getByRole('button', { name: /scroll to top/i });
    expect(button.className).toContain('opacity-0');
  });

  it('becomes visible when scroll Y position exceeds threshold', () => {
    const { getByRole } = render(<ScrollToTop threshold={300} />);
    const button = getByRole('button', { name: /scroll to top/i });

    act(() => {
      window.scrollY = 400;
      fireEvent.scroll(window);
    });

    expect(button.className).toContain('opacity-100');
  });

  it('triggers window.scrollTo with top 0 and smooth behavior when clicked', () => {
    const { getByRole } = render(<ScrollToTop threshold={300} />);
    const button = getByRole('button', { name: /scroll to top/i });

    act(() => {
      window.scrollY = 500;
      fireEvent.scroll(window);
    });

    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
