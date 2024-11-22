import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import ChartsContainer from 'mf2/ChartsContainer';

const meta = {
    title: 'Components/ChartsContainer',
    component: ChartsContainer,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof ChartsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};