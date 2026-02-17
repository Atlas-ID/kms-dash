import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Simple smoke test component
function HelloWorld() {
    return <h1>Hello World</h1>;
}

describe('Smoke Test', () => {
    it('renders correctly', () => {
        const { getByText } = render(<HelloWorld />);
        expect(getByText('Hello World')).toBeInTheDocument();
    });
});
