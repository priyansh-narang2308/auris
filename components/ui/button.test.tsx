import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { expect, test } from 'vitest';
import * as React from 'react';

test('Button renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
