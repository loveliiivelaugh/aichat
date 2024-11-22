import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import AuthProvider from 'mf2/AuthProvider';

const meta = {
    title: 'Components/AuthProvider',
    component: AuthProvider,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AuthProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
