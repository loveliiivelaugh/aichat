import type { Meta, StoryObj } from '@storybook/react';
// import { expect, userEvent, within } from '@storybook/test';

// @ts-ignore
// import Navbar from 'mf2/Navbar';
import Navbar from '../components/examples/Navbar';


const meta = {
    title: 'Components/Navbar',
    component: Navbar,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};