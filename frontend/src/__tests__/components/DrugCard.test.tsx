import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrugCard from '../../components/DrugCard';
import type { Drug } from '../../types';

const mockDrug: Drug = {
  id: 1,
  code: '12345-678',
  name: 'Ibuprofen (Advil)',
  company: 'Johnson & Johnson',
  launchDate: '2023-01-15T00:00:00.000Z',
};

const mockProps = {
  drug: mockDrug,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onView: vi.fn(),
};

describe('DrugCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders drug information correctly', () => {
    render(<DrugCard {...mockProps} />);

    expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
    expect(screen.getByText('Advil')).toBeInTheDocument();
    expect(screen.getByText('Johnson & Johnson')).toBeInTheDocument();
    expect(screen.getByText('12345-678')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2023')).toBeInTheDocument();
  });

  it('displays company initials in avatar', () => {
    render(<DrugCard {...mockProps} />);

    const avatar = screen.getByText('JJ');
    expect(avatar).toBeInTheDocument();
  });

  it('handles drug name without brand name', () => {
    const drugWithoutBrand = {
      ...mockDrug,
      name: 'Aspirin',
    };

    render(
      <DrugCard
        drug={drugWithoutBrand}
        onEdit={mockProps.onEdit}
        onDelete={mockProps.onDelete}
        onView={mockProps.onView}
      />
    );

    expect(screen.getByText('Aspirin')).toBeInTheDocument();
    expect(screen.queryByText('(', { exact: false })).not.toBeInTheDocument();
  });

  it('calls onView when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<DrugCard {...mockProps} />);

    const viewButton = screen.getByLabelText(/view details/i);
    await user.click(viewButton);

    expect(mockProps.onView).toHaveBeenCalledWith(mockDrug);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<DrugCard {...mockProps} />);

    const editButton = screen.getByLabelText(/edit drug/i);
    await user.click(editButton);

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockDrug);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<DrugCard {...mockProps} />);

    const deleteButton = screen.getByLabelText(/delete drug/i);
    await user.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockDrug);
  });

  it('opens context menu when more options button is clicked', async () => {
    const user = userEvent.setup();
    render(<DrugCard {...mockProps} />);

    const moreButton = screen.getByRole('button', { name: 'MoreVertIcon' });
    await user.click(moreButton);

    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Edit Drug')).toBeInTheDocument();
    expect(screen.getByText('Delete Drug')).toBeInTheDocument();
  });

  it('handles context menu actions', async () => {
    const user = userEvent.setup();
    render(<DrugCard {...mockProps} />);

    // Open context menu - find the more options button
    const buttons = screen.getAllByRole('button');
    const moreButton = buttons.find(
      button => button.textContent === 'MoreVertIcon'
    );
    await user.click(moreButton!);

    // Click view in context menu
    const viewMenuItem = screen.getByText('View Details');
    await user.click(viewMenuItem);

    expect(mockProps.onView).toHaveBeenCalledWith(mockDrug);
  });
});
