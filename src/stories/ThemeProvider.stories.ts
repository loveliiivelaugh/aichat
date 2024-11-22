import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import ThemeProvider from 'mf2/ThemeProvider';

const meta = {
    title: 'Components/ThemeProvider',
    component: ThemeProvider,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
