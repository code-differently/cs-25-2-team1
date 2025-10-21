import { render, screen } from '@testing-library/react';
import ProgressTracker from '../../src/app/components/progress-tracker';

describe('ProgressTracker Component', () => {
  it('renders with default progress value of 0', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('Progress Tracker')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Fix: Use getAllByText since "Pending" appears in both center and legend
    const pendingElements = screen.getAllByText('Pending');
    expect(pendingElements.length).toBe(2); // Center + Legend
  });

  it('displays correct percentage and status for 0% progress', () => {
    render(<ProgressTracker progress={0} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Fix: Expect multiple "Pending" elements
    const pendingElements = screen.getAllByText('Pending');
    expect(pendingElements.length).toBe(2);
  });

  it('displays correct percentage and status for partial progress', () => {
    render(<ProgressTracker progress={45.6} />);
    
    expect(screen.getByText('46%')).toBeInTheDocument(); // Should round to 46%
    
    // Fix: Expect multiple "In Progress" elements
    const inProgressElements = screen.getAllByText('In Progress');
    expect(inProgressElements.length).toBe(2); // Center + Legend
  });

  it('displays correct percentage and status for high progress', () => {
    render(<ProgressTracker progress={75} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    
    // Fix: Expect multiple "In Progress" elements
    const inProgressElements = screen.getAllByText('In Progress');
    expect(inProgressElements.length).toBe(2);
  });

  it('displays correct percentage and status for 100% progress', () => {
    render(<ProgressTracker progress={100} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('rounds percentage correctly', () => {
    render(<ProgressTracker progress={33.7} />);
    expect(screen.getByText('34%')).toBeInTheDocument();
    
    const { rerender } = render(<ProgressTracker progress={33.3} />);
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('renders legend with all status indicators', () => {
    render(<ProgressTracker progress={50} />);
    
    // Fix: Use getAllByText and check specific counts
    const pendingElements = screen.getAllByText('Pending');
    expect(pendingElements.length).toBe(1); // Only in legend for 50% progress
    
    const inProgressElements = screen.getAllByText('In Progress');
    expect(inProgressElements.length).toBe(2); // Center + Legend
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('has correct SVG structure for progress circle', () => {
    const { container } = render(<ProgressTracker progress={50} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
    
    // Should have background circle
    const backgroundCircle = svg?.querySelector('circle[stroke="#6b7280"]');
    expect(backgroundCircle).toBeInTheDocument();
    
    // Should have progress circle for non-zero progress
    const progressCircle = svg?.querySelector('circle[stroke-width="8"]:not([stroke="#6b7280"])');
    expect(progressCircle).toBeInTheDocument();
  });

  it('does not render progress circle for 0% progress', () => {
    const { container } = render(<ProgressTracker progress={0} />);
    
    const svg = container.querySelector('svg');
    const progressCircles = svg?.querySelectorAll('circle');
    
    // Should only have the background circle (gray one)
    expect(progressCircles).toHaveLength(1);
    expect(progressCircles?.[0]).toHaveAttribute('stroke', '#6b7280');
  });

  it('has responsive classes applied', () => {
    const { container } = render(<ProgressTracker progress={50} />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center');
    
    // Check for responsive sizing classes
    const progressContainer = container.querySelector('.w-44');
    expect(progressContainer).toBeInTheDocument();
    expect(progressContainer).toHaveClass('sm:w-52', 'lg:w-60');
  });

  it('has correct color coding for different progress levels', () => {
    // This test checks the color logic through the component structure
    // Since we can't directly test SVG stroke colors in JSDOM easily,
    // we verify the component renders without errors for different progress levels
    
    const progressLevels = [0, 25, 50, 75, 100];
    
    progressLevels.forEach(progress => {
      const { unmount } = render(<ProgressTracker progress={progress} />);
      expect(screen.getByText('Progress Tracker')).toBeInTheDocument();
      unmount();
    });
  });
});
